'use client';

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { TextMorph } from '../text-morph/TextMorph';
import { Button } from '../button/Button';
import './UploadFiles.css';

export type UploadStatus = 'uploading' | 'complete' | 'error';

export interface UploadFile {
  /** Stable id — used as the React key and passed back to onRemove. */
  id: string;
  /** File name including extension; drives the type badge. */
  name: string;
  /** Total size in bytes. */
  size: number;
  /** Bytes transferred so far. Drives the "X OF Y" label and, when
   *  `progress` is omitted, the percentage. */
  uploaded?: number;
  /** Progress 0–100. Falls back to uploaded / size when omitted. */
  progress?: number;
  /** Lifecycle state. */
  status: UploadStatus;
  /** Optional override for the file-type badge. */
  icon?: ReactNode;
  /** Source for the preview modal — an image/pdf/video URL or object URL.
   *  When present, the built-in preview renders the real content; otherwise
   *  it falls back to a file-info card. */
  url?: string;
}

export type UploadTheme = 'auto' | 'light' | 'dark';

export interface UploadFilesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The files to render. The component is controlled — it draws this
   *  list and emits events; the consumer owns the upload + progress. */
  files: UploadFile[];
  /** Panel heading. Defaults to "Upload files". */
  title?: ReactNode;
  /** Caption under the dropzone. Defaults to "MAX FILE SIZE: 20 MB". */
  maxSizeLabel?: string;
  /** Forwarded to the hidden file input's `accept`. */
  accept?: string;
  /** Allow selecting multiple files. Defaults to true. */
  multiple?: boolean;
  /** Color scheme. Dark by default; "auto" follows the OS. */
  theme?: UploadTheme;
  /** Words cycled (and morphed) in the per-file status while uploading.
   *  Defaults to a long, varied upload vocabulary so the wait stays lively. */
  statusWords?: string[];
  /** Footer action button content. Defaults to a state-derived label
   *  ("Uploading…" while in flight, "Done" otherwise). */
  actionLabel?: ReactNode;
  /** Enable the multi-select-to-delete variant. Long-press a row (touch) or
   *  tap a row's trash (pointer) to enter selection mode, pick files, then
   *  confirm a bulk delete. Defaults to false (each trash deletes instantly). */
  selectable?: boolean;
  /** Make filenames clickable to open a preview modal. Defaults to true. */
  previewable?: boolean;
  /** Custom body for the preview modal. Receives the clicked file; return any
   *  node. When omitted, a built-in renderer shows the image / pdf / video at
   *  `file.url`, or a file-info card when there's nothing to display. */
  renderPreview?: (file: UploadFile) => ReactNode;
  /** Fired with the dropped / browsed File objects. */
  onFilesSelected?: (files: File[]) => void;
  /** Fired when a single row's trash / cancel control is pressed (non-select
   *  mode). */
  onRemove?: (id: string) => void;
  /** Fired when selection mode confirms a bulk delete. Falls back to calling
   *  onRemove once per id when not provided. */
  onRemoveSelected?: (ids: string[]) => void;
  /** Fired by the "Remove all" footer control. */
  onRemoveAll?: () => void;
  /** When provided, renders the header close (×) button. */
  onClose?: () => void;
  /** Fired by the footer action button. */
  onAction?: () => void;
  /** Fired when a filename is clicked to preview — handy for lazy-loading the
   *  preview URL. The built-in modal still opens. */
  onPreview?: (file: UploadFile) => void;
}

const DEFAULT_STATUS_WORDS = [
  'Uploading…',
  'Transferring…',
  'Beaming bytes…',
  'Encrypting…',
  'Securing…',
  'Packing bits…',
  'Syncing…',
  'Crunching data…',
  'Pushing pixels…',
  'Almost there…',
  'Hang tight…',
  'Wrangling chunks…',
  'Verifying…',
  'Finalizing…',
  'Just a sec…',
];

const EXT_META: Record<string, { label: string; color: string }> = {
  pdf: { label: 'PDF', color: '#f0524b' },
  doc: { label: 'DOC', color: '#3b82f6' },
  docx: { label: 'DOCX', color: '#3b82f6' },
  fig: { label: 'FIG', color: '#a259ff' },
  png: { label: 'PNG', color: '#10b981' },
  jpg: { label: 'JPG', color: '#10b981' },
  jpeg: { label: 'JPG', color: '#10b981' },
  gif: { label: 'GIF', color: '#10b981' },
  svg: { label: 'SVG', color: '#f59e0b' },
  zip: { label: 'ZIP', color: '#f59e0b' },
  mp4: { label: 'MP4', color: '#ec4899' },
  csv: { label: 'CSV', color: '#22c55e' },
  json: { label: 'JSON', color: '#eab308' },
  default: { label: 'FILE', color: '#8b8b94' },
};

function fileExt(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function extMeta(name: string) {
  return EXT_META[fileExt(name)] ?? EXT_META.default!;
}

function trimNum(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

/** Human-readable byte size, e.g. 2.7 MB / 14 MB. */
function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${trimNum(kb)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${trimNum(mb)} MB`;
  return `${trimNum(mb / 1024)} GB`;
}

/** Deterministic-ish shuffle (Fisher–Yates) so the word order varies per
 *  session without two adjacent entries being the same word. */
function shuffle<T>(input: T[]): T[] {
  const a = input.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const cn = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(' ');

/* ── Icons ──────────────────────────────────────────────────────────────── */

const UploadGlyph = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path
      d="M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14v3.5A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5V14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const CloseGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const TrashGlyph = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
    <path
      d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m2 0v11.5A1.5 1.5 0 0 1 15.5 20h-7A1.5 1.5 0 0 1 7 18.5V7m3 3.5v6m4-6v6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
    <path
      d="M4 12.5l5 5 11-12"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckSmall = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true">
    <path
      d="M5 12.5l4.5 4.5L19 6"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Default preview body ─────────────────────────────────────────────────── */

function DefaultPreview({ file }: { file: UploadFile }) {
  const meta = extMeta(file.name);
  const ext = fileExt(file.name);
  const url = file.url;

  if (url && /^(png|jpe?g|gif|webp|svg|avif|bmp)$/.test(ext)) {
    return <img className="royui-upload__preview-img" src={url} alt={file.name} />;
  }
  if (url && ext === 'pdf') {
    return (
      <iframe className="royui-upload__preview-frame" src={url} title={file.name} />
    );
  }
  if (url && /^(mp4|webm|mov|ogg)$/.test(ext)) {
    return <video className="royui-upload__preview-video" src={url} controls />;
  }

  return (
    <div className="royui-upload__preview-card">
      <span
        className="royui-upload__preview-badge"
        style={{ ['--royui-upload-badge' as string]: meta.color }}
        aria-hidden="true"
      >
        {file.icon ?? <span className="royui-upload__badge-label">{meta.label}</span>}
      </span>
      <p className="royui-upload__preview-name">{file.name}</p>
      <p className="royui-upload__preview-sub">
        {formatBytes(file.size)} · {meta.label}
      </p>
      {url ? (
        <a
          className="royui-upload__preview-download"
          href={url}
          download={file.name}
          target="_blank"
          rel="noreferrer"
        >
          Open file
        </a>
      ) : (
        <p className="royui-upload__preview-empty">No inline preview available.</p>
      )}
    </div>
  );
}

function PreviewModal({
  file,
  renderPreview,
  onClose,
}: {
  file: UploadFile;
  renderPreview?: (file: UploadFile) => ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="royui-upload__modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${file.name}`}
      onClick={onClose}
    >
      <div
        className="royui-upload__modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="royui-upload__modal-head">
          <span className="royui-upload__modal-title" title={file.name}>
            {file.name}
          </span>
          <button
            type="button"
            className="royui-upload__close"
            aria-label="Close preview"
            onClick={onClose}
          >
            <CloseGlyph />
          </button>
        </header>
        <div className="royui-upload__modal-body">
          {renderPreview ? renderPreview(file) : <DefaultPreview file={file} />}
        </div>
      </div>
    </div>
  );
}

/* ── File row ───────────────────────────────────────────────────────────── */

function FileRow({
  file,
  word,
  selectable,
  selecting,
  selected,
  previewable,
  onRemove,
  onEnterSelect,
  onToggleSelect,
  onPreview,
}: {
  file: UploadFile;
  word: string;
  selectable: boolean;
  selecting: boolean;
  selected: boolean;
  previewable: boolean;
  onRemove?: (id: string) => void;
  onEnterSelect: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onPreview: (file: UploadFile) => void;
}) {
  const meta = extMeta(file.name);
  const pct =
    file.progress != null
      ? Math.max(0, Math.min(100, Math.round(file.progress)))
      : file.size > 0
        ? Math.max(0, Math.min(100, Math.round(((file.uploaded ?? 0) / file.size) * 100)))
        : 0;

  const isUploading = file.status === 'uploading';
  const isError = file.status === 'error';

  // Long-press (touch) to enter selection mode. A guard suppresses the click
  // that fires right after the press so it doesn't immediately toggle back.
  const pressTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressClick = useRef(false);

  const clearPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = undefined;
    }
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!selectable || selecting || e.pointerType === 'mouse') return;
    clearPress();
    pressTimer.current = setTimeout(() => {
      suppressClick.current = true;
      onEnterSelect(file.id);
    }, 450);
  };

  const onRowClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    if (selecting) onToggleSelect(file.id);
  };

  const nameClickable = previewable && !selecting;

  return (
    <div
      className={cn(
        'royui-upload__row',
        selecting && 'is-selecting',
        selected && 'is-selected',
      )}
      data-status={file.status}
      data-selected={selected || undefined}
      onPointerDown={onPointerDown}
      onPointerUp={clearPress}
      onPointerLeave={clearPress}
      onPointerMove={clearPress}
      onContextMenu={(e) => {
        if (selectable) e.preventDefault();
      }}
      onClick={onRowClick}
    >
      <span
        className="royui-upload__badge"
        style={{ ['--royui-upload-badge' as string]: file.icon ? 'transparent' : meta.color }}
        aria-hidden="true"
      >
        {file.icon ?? <span className="royui-upload__badge-label">{meta.label}</span>}
      </span>

      <div className="royui-upload__row-main">
        {nameClickable ? (
          <button
            type="button"
            className="royui-upload__name royui-upload__name--button"
            title={`Preview ${file.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
          >
            {file.name}
          </button>
        ) : (
          <span className="royui-upload__name" title={file.name}>
            {file.name}
          </span>
        )}

        <div className="royui-upload__meta">
          {file.status === 'complete' && (
            <>
              <span>{formatBytes(file.size)}</span>
              <span className="royui-upload__meta-sep">/</span>
              <span className="royui-upload__complete">
                <CheckGlyph />
                Complete
              </span>
            </>
          )}
          {isUploading && (
            <>
              <span>
                <TextMorph value={formatBytes(file.uploaded ?? 0)} /> of{' '}
                {formatBytes(file.size)}
              </span>
              <span className="royui-upload__meta-sep">/</span>
              <TextMorph
                className="royui-upload__status"
                value={word}
                renderText={(t) => (
                  <span className="royui-upload__shimmer">{t}</span>
                )}
              />
            </>
          )}
          {isError && (
            <>
              <span>{formatBytes(file.size)}</span>
              <span className="royui-upload__meta-sep">/</span>
              <span className="royui-upload__error">Failed</span>
            </>
          )}
        </div>

        {isUploading && (
          <div className="royui-upload__progress">
            <div
              className="royui-upload__bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="royui-upload__bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="royui-upload__pct">{pct}%</span>
          </div>
        )}
      </div>

      {selecting ? (
        <span
          className={cn('royui-upload__check', selected && 'is-checked')}
          aria-hidden="true"
        >
          {selected && <CheckSmall />}
        </span>
      ) : (
        <button
          type="button"
          className="royui-upload__row-action"
          aria-label={
            selectable
              ? `Select files to delete, starting with ${file.name}`
              : isUploading
                ? `Cancel ${file.name}`
                : `Remove ${file.name}`
          }
          onClick={(e) => {
            e.stopPropagation();
            if (selectable) onEnterSelect(file.id);
            else onRemove?.(file.id);
          }}
        >
          {isUploading ? <CloseGlyph /> : <TrashGlyph />}
        </button>
      )}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */

export const UploadFiles = forwardRef<HTMLDivElement, UploadFilesProps>(
  function UploadFiles(
    {
      files,
      title = 'Upload files',
      maxSizeLabel = 'MAX FILE SIZE: 20 MB',
      accept,
      multiple = true,
      theme = 'dark',
      statusWords = DEFAULT_STATUS_WORDS,
      actionLabel,
      selectable = false,
      previewable = true,
      renderPreview,
      onFilesSelected,
      onRemove,
      onRemoveSelected,
      onRemoveAll,
      onClose,
      onAction,
      onPreview,
      className = '',
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setDragging] = useState(false);
    const [tick, setTick] = useState(0);
    const [selecting, setSelecting] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(() => new Set());
    const [preview, setPreview] = useState<UploadFile | null>(null);

    const anyUploading = files.some((f) => f.status === 'uploading');

    // Shuffle once per mount so the word order varies between sessions.
    const words = useMemo(
      () => (statusWords.length ? shuffle(statusWords) : DEFAULT_STATUS_WORDS),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    // Advance the shared cycle only while something is in flight.
    useEffect(() => {
      if (!anyUploading) return;
      const id = setInterval(() => setTick((t) => t + 1), 1900);
      return () => clearInterval(id);
    }, [anyUploading]);

    // Drop selection state once the list empties or selection is exited.
    useEffect(() => {
      if (files.length === 0 && selecting) {
        setSelecting(false);
        setSelected(new Set());
      }
    }, [files.length, selecting]);

    const emit = (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFilesSelected?.(Array.from(list));
    };

    const enterSelect = (id: string) => {
      setSelecting(true);
      setSelected(new Set([id]));
    };
    const toggleSelect = (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    };
    const cancelSelect = () => {
      setSelecting(false);
      setSelected(new Set());
    };
    const confirmDelete = () => {
      const ids = Array.from(selected);
      if (ids.length === 0) return;
      if (onRemoveSelected) onRemoveSelected(ids);
      else ids.forEach((id) => onRemove?.(id));
      cancelSelect();
    };
    const openPreview = (file: UploadFile) => {
      setPreview(file);
      onPreview?.(file);
    };

    // Morph the title between the panel name and the live selection count.
    // (Falls back to the raw node when a custom non-string title is passed.)
    const headingText = selecting
      ? `${selected.size} selected`
      : typeof title === 'string'
        ? title
        : null;

    const classes = cn(
      'royui-upload',
      theme === 'dark' && 'royui-upload--dark',
      theme === 'light' && 'royui-upload--light',
      theme === 'auto' && 'royui-upload--auto',
      selecting && 'royui-upload--selecting',
      className,
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="royui-upload__header">
          <h2 className="royui-upload__title">
            {headingText !== null ? <TextMorph value={headingText} /> : title}
          </h2>
          {selecting ? (
            <button
              type="button"
              className="royui-upload__close"
              aria-label="Exit selection"
              onClick={cancelSelect}
            >
              <CloseGlyph />
            </button>
          ) : (
            onClose && (
              <button
                type="button"
                className="royui-upload__close"
                aria-label="Close"
                onClick={onClose}
              >
                <CloseGlyph />
              </button>
            )
          )}
        </header>

        <div
          className={cn('royui-upload__dropzone', isDragging && 'is-dragging')}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            emit(e.dataTransfer.files);
          }}
        >
          <span className="royui-upload__drop-icon" aria-hidden="true">
            <UploadGlyph />
          </span>
          <p className="royui-upload__drop-text">
            Drag and drop or{' '}
            <button
              type="button"
              className="royui-upload__browse"
              onClick={() => inputRef.current?.click()}
            >
              browse files
            </button>
          </p>
          <p className="royui-upload__drop-hint">{maxSizeLabel}</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="royui-upload__input"
            onChange={(e) => {
              emit(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {files.length > 0 && (
          <div className="royui-upload__list">
            {files.map((file, i) => (
              <FileRow
                key={file.id}
                file={file}
                word={words[(tick + i) % words.length]!}
                selectable={selectable}
                selecting={selecting}
                selected={selected.has(file.id)}
                previewable={previewable}
                onRemove={onRemove}
                onEnterSelect={enterSelect}
                onToggleSelect={toggleSelect}
                onPreview={openPreview}
              />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <footer className="royui-upload__footer">
            <div
              className="royui-upload__footer-inner"
              key={selecting ? 'select' : 'browse'}
            >
              {selecting ? (
                <>
                  <button
                    type="button"
                    className="royui-upload__textbtn"
                    onClick={cancelSelect}
                  >
                    Cancel
                  </button>
                  <span className="royui-upload__footer-spacer" />
                  <Button
                    size="sm"
                    className="royui-upload__action royui-upload__action--danger"
                    color="#e5484d"
                    disabled={selected.size === 0}
                    onClick={confirmDelete}
                  >
                    Delete{selected.size > 0 ? ` (${selected.size})` : ''}
                  </Button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="royui-upload__remove-all"
                    aria-label="Remove all files"
                    onClick={onRemoveAll}
                  >
                    <TrashGlyph />
                    All
                  </button>
                  <span className="royui-upload__footer-spacer" />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="royui-upload__action"
                    disabled={anyUploading}
                    onClick={onAction}
                  >
                    {actionLabel ??
                      (anyUploading ? <TextMorph value="Uploading…" /> : 'Done')}
                  </Button>
                </>
              )}
            </div>
          </footer>
        )}

        {preview && (
          <PreviewModal
            file={preview}
            renderPreview={renderPreview}
            onClose={() => setPreview(null)}
          />
        )}
      </div>
    );
  },
);

UploadFiles.displayName = 'UploadFiles';
