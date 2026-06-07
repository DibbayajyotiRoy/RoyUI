import type { ReactNode } from 'react';
import { MadeBy } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { UploadFilesDemo } from './demos/UploadFilesDemo';

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function CreditNote() {
  return (
    <div className="credit-note">
      <p className="credit-note__text">
        This pattern is a faithful rebuild of a concept by{' '}
        <strong>Maxim Kuznetsov</strong> — the layout, the segmented upload bars,
        the light and dark themes, and the drag-and-drop flow are all his design.
        I turned it into a controlled React component and added one tiny
        refinement of my own: the morphing, shimmering status line while a file
        uploads.
      </p>
      <MadeBy
        name="Maxim Kuznetsov"
        href="https://x.com/disarto_max"
        prefix="Originally designed by"
        icon={<XGlyph />}
        style={{ position: 'static' }}
      />
    </div>
  );
}

export function UploadFilesDocs() {
  return (
    <>
      <CreditNote />

      <DocSection
        id="installation"
        eyebrow="01"
        title="Installation"
        description="One install. The component ships its own CSS — no extra stylesheet import."
      >
        <div className="install-grid">
          <InstallTabs pkg="@roy-ui/ui" />
          <Code label="Import" code={`import { UploadFiles } from '@roy-ui/ui';`} />
        </div>
      </DocSection>

      <DocSection
        id="usage"
        eyebrow="02"
        title="Usage"
        description="UploadFiles is controlled: you hand it a files array and wire the callbacks. The dropzone and browse button hand you back native File objects via onFilesSelected — you own the actual upload and feed progress back through the files prop. While a file is in flight, its status line morphs through a rotating upload vocabulary under a Claude-style shimmer, and the segmented bar fills."
      >
        <Example
          title="Drag, drop, upload"
          description="A self-running demo: the seeded files climb to 100%, then it resets. Drop or browse to add your own — they start at 0% and animate up."
          code={`const MB = 1024 * 1024;
const [files, setFiles] = useState<UploadFile[]>([
  { id: '1', name: 'investor-pitch-deck.pdf', size: 14 * MB,
    uploaded: 14 * MB, progress: 100, status: 'complete' },
  { id: '2', name: 'landing-copy-update.docx', size: 4 * MB,
    uploaded: 2.7 * MB, progress: 68, status: 'uploading' },
  { id: '3', name: 'product-ui-concepts.fig', size: 14 * MB,
    uploaded: 4.5 * MB, progress: 32, status: 'uploading' },
]);

<UploadFiles
  files={files}
  onFilesSelected={(picked) => {
    // kick off your real upload here, then update \`files\`
    setFiles((prev) => [
      ...prev,
      ...picked.map((f, i) => ({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        uploaded: 0,
        progress: 0,
        status: 'uploading' as const,
      })),
    ]);
  }}
  onRemove={(id) => setFiles((p) => p.filter((f) => f.id !== id))}
  onRemoveAll={() => setFiles([])}
  onClose={() => {/* close your modal */}}
/>`}
        >
          <div style={{ width: '100%', maxWidth: 460 }}>
            <UploadFilesDemo theme="dark" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="03"
        title="Theming"
        description="Dark by default. Pass theme=&quot;light&quot; for the light surface, or theme=&quot;auto&quot; to follow the OS. Every surface, the accent, and the progress track are CSS variables (--royui-upload-*) you can override inline."
      >
        <Example
          title="Light surface"
          description="The same component with theme=&quot;light&quot;."
          code={`<UploadFiles theme="light" files={files} /* … */ />`}
        >
          <div style={{ width: '100%', maxWidth: 460 }}>
            <UploadFilesDemo theme="light" />
          </div>
        </Example>

        <Example
          title="Recolor the accent"
          description="Override --royui-upload-accent to retheme the link, dropzone highlight, and progress fill in one line."
          code={`<UploadFiles
  files={files}
  style={{ ['--royui-upload-accent' as string]: '#6366f1' }}
/>`}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 460,
              ['--royui-upload-accent' as string]: '#6366f1',
            }}
          >
            <UploadFilesDemo theme="dark" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="props"
        eyebrow="04"
        title="Props"
        description="Every native div attribute is forwarded — id, style, className, data-*, ref."
      >
        <PropsTable />
      </DocSection>
    </>
  );
}

function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="doc-section" id={id}>
      <div className="doc-section__head">
        <div className="doc-section__eyebrow">{eyebrow}</div>
        <h2 className="doc-section__title">{title}</h2>
        <p className="doc-section__desc">{description}</p>
      </div>
      {children}
    </section>
  );
}

async function Example({
  title,
  description,
  code,
  children,
}: {
  title: string;
  description: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        <p className="example__desc">{description}</p>
      </header>
      <PreviewTabs preview={children} code={<Code code={code} />} />
    </article>
  );
}

function PropsTable() {
  const rows = [
    {
      name: 'files',
      type: 'UploadFile[]',
      def: '—',
      desc: 'The controlled list of files to render. Each: { id, name, size, uploaded?, progress?, status, icon? }.',
    },
    {
      name: 'onFilesSelected',
      type: '(files: File[]) => void',
      def: '—',
      desc: 'Fired with the native File objects from drag-drop and the browse button.',
    },
    {
      name: 'onRemove',
      type: '(id: string) => void',
      def: '—',
      desc: "A row's trash (complete) or × (uploading) control was pressed.",
    },
    {
      name: 'onRemoveAll',
      type: '() => void',
      def: '—',
      desc: 'The footer "Remove all" control was pressed.',
    },
    {
      name: 'onClose',
      type: '() => void',
      def: '—',
      desc: 'When provided, the header close (×) button renders and calls this.',
    },
    {
      name: 'onAction',
      type: '() => void',
      def: '—',
      desc: 'The footer action button was pressed.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      def: "'Upload files'",
      desc: 'Panel heading.',
    },
    {
      name: 'maxSizeLabel',
      type: 'string',
      def: "'MAX FILE SIZE: 20 MB'",
      desc: 'Mono caption under the dropzone.',
    },
    {
      name: 'accept',
      type: 'string',
      def: '—',
      desc: "Forwarded to the hidden file input's accept attribute.",
    },
    {
      name: 'multiple',
      type: 'boolean',
      def: 'true',
      desc: 'Allow selecting more than one file at a time.',
    },
    {
      name: 'theme',
      type: "'auto' | 'light' | 'dark'",
      def: "'dark'",
      desc: 'Color scheme. "auto" follows prefers-color-scheme.',
    },
    {
      name: 'statusWords',
      type: 'string[]',
      def: '15-word default set',
      desc: 'Words cycled and morphed in the per-file status while uploading. Shuffled per mount.',
    },
    {
      name: 'actionLabel',
      type: 'ReactNode',
      def: 'state-derived',
      desc: 'Footer button content. Defaults to "Uploading…" while in flight, else "Done".',
    },
    {
      name: '...rest',
      type: 'HTMLAttributes<HTMLDivElement>',
      def: '—',
      desc: 'All native div props (className, style, id, data-*, ref).',
    },
  ];
  return (
    <table className="props">
      <thead>
        <tr>
          <th style={{ width: '20%' }}>Prop</th>
          <th style={{ width: '30%' }}>Type</th>
          <th style={{ width: '16%' }}>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td className="prop-name">
              <code>{r.name}</code>
            </td>
            <td className="prop-type">
              <code>{r.type}</code>
            </td>
            <td className="prop-default">
              <code>{r.def}</code>
            </td>
            <td className="prop-desc">{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
