'use client';

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
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
  /** Fired with the dropped / browsed File objects. */
  onFilesSelected?: (files: File[]) => void;
  /** Fired when a single row's trash / cancel control is pressed. */
  onRemove?: (id: string) => void;
  /** Fired by the "Remove all" footer control. */
  onRemoveAll?: () => void;
  /** When provided, renders the header close (×) button. */
  onClose?: () => void;
  /** Fired by the footer action button. */
  onAction?: () => void;
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

function extMeta(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_META[ext] ?? EXT_META.default!;
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
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
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

const KebabGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="5" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="12" cy="19" r="1.7" />
  </svg>
);

/* ── File row ───────────────────────────────────────────────────────────── */

function FileRow({
  file,
  word,
  onRemove,
}: {
  file: UploadFile;
  word: string;
  onRemove?: (id: string) => void;
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

  return (
    <div className="royui-upload__row" data-status={file.status}>
      <span
        className="royui-upload__badge"
        style={{ ['--royui-upload-badge' as string]: file.icon ? 'transparent' : meta.color }}
        aria-hidden="true"
      >
        {file.icon ?? <span className="royui-upload__badge-label">{meta.label}</span>}
      </span>

      <div className="royui-upload__row-main">
        <div className="royui-upload__row-top">
          <span className="royui-upload__name" title={file.name}>
            {file.name}
          </span>
          <button
            type="button"
            className="royui-upload__row-action"
            aria-label={isUploading ? `Cancel ${file.name}` : `Remove ${file.name}`}
            onClick={() => onRemove?.(file.id)}
          >
            {isUploading ? <CloseGlyph /> : <TrashGlyph />}
          </button>
        </div>

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
      onFilesSelected,
      onRemove,
      onRemoveAll,
      onClose,
      onAction,
      className = '',
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setDragging] = useState(false);
    const [tick, setTick] = useState(0);

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

    const emit = (list: FileList | null) => {
      if (!list || list.length === 0) return;
      onFilesSelected?.(Array.from(list));
    };

    const classes = cn(
      'royui-upload',
      theme === 'dark' && 'royui-upload--dark',
      theme === 'light' && 'royui-upload--light',
      theme === 'auto' && 'royui-upload--auto',
      className,
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        <header className="royui-upload__header">
          <h2 className="royui-upload__title">{title}</h2>
          {onClose && (
            <button
              type="button"
              className="royui-upload__close"
              aria-label="Close"
              onClick={onClose}
            >
              <CloseGlyph />
            </button>
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
                onRemove={onRemove}
              />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <footer className="royui-upload__footer">
            <button
              type="button"
              className="royui-upload__icon-btn"
              aria-label="More options"
            >
              <KebabGlyph />
            </button>
            <button
              type="button"
              className="royui-upload__remove-all"
              onClick={onRemoveAll}
            >
              <TrashGlyph />
              Remove all
            </button>
            <span className="royui-upload__footer-spacer" />
            <Button
              size="sm"
              variant="secondary"
              disabled={anyUploading}
              onClick={onAction}
            >
              {actionLabel ??
                (anyUploading ? (
                  <TextMorph value="Uploading…" />
                ) : (
                  'Done'
                ))}
            </Button>
          </footer>
        )}
      </div>
    );
  },
);

UploadFiles.displayName = 'UploadFiles';
