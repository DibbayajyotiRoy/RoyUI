import type { ReactNode } from 'react';
import { MadeBy } from '@roy-ui/ui';
import { Code } from './Code';
import { InstallTabs } from './InstallTabs';
import { PreviewTabs } from './PreviewTabs';
import { UploadFilesDemo } from './demos/UploadFilesDemo';
import { UploadFilesSelectableDemo } from './demos/UploadFilesSelectableDemo';

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
        description="Install the package and import the component. The styles come with it — there's no extra CSS file to add."
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
        description="You give UploadFiles a list of files to show. When someone drops or browses for files, you get them back through onFilesSelected — you do the uploading and update the list with the new progress. While a file is uploading, the status text animates and the bar fills up."
      >
        <Example
          title="Drag, drop, upload"
          description="This demo runs on its own: the files fill up to 100%, then start over. Drop or browse to add your own — they begin at 0% and climb."
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
        id="selection"
        eyebrow="03"
        title="Selecting and deleting many"
        description="Add the selectable prop to let people pick several files and delete them at once. To start picking: long-press a row on a phone, or click a row's trash on a computer. Then tap rows to check or uncheck them and press Delete. You get the chosen file ids in onRemoveSelected."
      >
        <Example
          title="Pick a few, then delete"
          description="All four files are done. Start picking (long-press a row, or click its trash), check a few, and press Delete. Click a file's name to preview it. A Reset button shows up once the list is empty."
          code={`const [files, setFiles] = useState<UploadFile[]>(initial);

<UploadFiles
  selectable
  files={files}
  onRemoveSelected={(ids) =>
    setFiles((prev) => prev.filter((f) => !ids.includes(f.id)))
  }
  onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
  onRemoveAll={() => setFiles([])}
/>`}
        >
          <UploadFilesSelectableDemo />
        </Example>
      </DocSection>

      <DocSection
        id="preview"
        eyebrow="04"
        title="Previewing a file"
        description="Click a file's name to open it in a pop-up. If you give the file a url, the pop-up shows the image, PDF, or video. If not, it shows a simple card with the file's name and size. Close it with Escape or by clicking outside. Turn this off with previewable={false}, or supply your own pop-up content with renderPreview."
      >
        <Example
          title="Click a filename"
          description="These files have no url, so the pop-up shows the simple info card. In the example above, hero-shot.png and cover.jpg have a url, so they show a real image."
          code={`<UploadFiles
  files={files}
  // previewable is true by default
  onPreview={(file) => {
    // optionally fetch + attach file.url here
  }}
  renderPreview={(file) => <MyViewer file={file} />} // optional
/>`}
        >
          <div style={{ width: '100%', maxWidth: 460 }}>
            <UploadFilesDemo theme="dark" />
          </div>
        </Example>
      </DocSection>

      <DocSection
        id="theming"
        eyebrow="05"
        title="Theming"
        description="It's dark by default. Use theme=&quot;light&quot; for a light look, or theme=&quot;auto&quot; to match the user's system. Colors are CSS variables (the --royui-upload-* names), so you can change any of them inline."
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
          title="Change the accent color"
          description="Set --royui-upload-accent to recolor the link, the dropzone highlight, and the progress bar — all in one line."
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
        eyebrow="06"
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
      desc: 'The list of files to show. Each one: { id, name, size, status, and optionally uploaded, progress, url, icon }.',
    },
    {
      name: 'onFilesSelected',
      type: '(files: File[]) => void',
      def: '—',
      desc: 'Called with the files the user dropped or browsed for. Start your upload here, then update the files list.',
    },
    {
      name: 'onRemove',
      type: '(id: string) => void',
      def: '—',
      desc: "Called when a row's trash (done) or × (uploading) is clicked.",
    },
    {
      name: 'onRemoveAll',
      type: '() => void',
      def: '—',
      desc: 'Called when the footer "All" button is clicked.',
    },
    {
      name: 'selectable',
      type: 'boolean',
      def: 'false',
      desc: 'Let users pick several files and delete them together. Long-press a row on touch, or click a row trash on a computer.',
    },
    {
      name: 'onRemoveSelected',
      type: '(ids: string[]) => void',
      def: '—',
      desc: 'Called with the picked file ids when Delete is pressed. If you skip it, onRemove is called once per id.',
    },
    {
      name: 'previewable',
      type: 'boolean',
      def: 'true',
      desc: 'Make filenames clickable to open the preview pop-up.',
    },
    {
      name: 'renderPreview',
      type: '(file: UploadFile) => ReactNode',
      def: '—',
      desc: "Your own content for the preview pop-up. Without it, the file's url is shown as an image, PDF, or video, or a simple info card.",
    },
    {
      name: 'onPreview',
      type: '(file: UploadFile) => void',
      def: '—',
      desc: 'Called when a filename is clicked. Good for loading the file url just in time. The pop-up still opens.',
    },
    {
      name: 'onClose',
      type: '() => void',
      def: '—',
      desc: 'If set, a close (×) button shows in the header and calls this.',
    },
    {
      name: 'onAction',
      type: '() => void',
      def: '—',
      desc: 'Called when the footer button (Done / Uploading…) is clicked.',
    },
    {
      name: 'title',
      type: 'ReactNode',
      def: "'Upload files'",
      desc: 'The heading at the top.',
    },
    {
      name: 'maxSizeLabel',
      type: 'string',
      def: "'MAX FILE SIZE: 20 MB'",
      desc: 'The small caption under the dropzone.',
    },
    {
      name: 'accept',
      type: 'string',
      def: '—',
      desc: 'Which file types the file picker allows (e.g. "image/*").',
    },
    {
      name: 'multiple',
      type: 'boolean',
      def: 'true',
      desc: 'Allow picking more than one file at a time.',
    },
    {
      name: 'theme',
      type: "'auto' | 'light' | 'dark'",
      def: "'dark'",
      desc: 'Color scheme. "auto" follows the system setting.',
    },
    {
      name: 'statusWords',
      type: 'string[]',
      def: '15-word default set',
      desc: 'The words that cycle in the status line while a file uploads.',
    },
    {
      name: 'actionLabel',
      type: 'ReactNode',
      def: 'auto',
      desc: 'The footer button text. Defaults to "Uploading…" while files upload, otherwise "Done".',
    },
    {
      name: '...rest',
      type: 'HTMLAttributes<HTMLDivElement>',
      def: '—',
      desc: 'Any extra div props (className, style, id, data-*, ref).',
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
