'use client';

import { useState } from 'react';
import { UploadFiles, type UploadFile } from '@roy-ui/ui';

const MB = 1024 * 1024;

let counter = 0;
const uid = () => `sel-${++counter}`;

// Inline SVG data-URIs so the preview modal shows a real image with no network.
function gradientImage(label: string, c1: string, c2: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
    </linearGradient></defs>
    <rect width='480' height='320' rx='16' fill='url(#g)'/>
    <text x='50%' y='53%' font-family='sans-serif' font-size='30' fill='white'
      text-anchor='middle'>${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function initial(): UploadFile[] {
  return [
    {
      id: uid(),
      name: 'hero-shot.png',
      size: 3.2 * MB,
      status: 'complete',
      url: gradientImage('hero-shot.png', '#ff7a45', '#a259ff'),
    },
    { id: uid(), name: 'brand-guidelines.pdf', size: 8 * MB, status: 'complete' },
    {
      id: uid(),
      name: 'cover.jpg',
      size: 2.1 * MB,
      status: 'complete',
      url: gradientImage('cover.jpg', '#3b82f6', '#10b981'),
    },
    { id: uid(), name: 'release-notes.docx', size: 0.6 * MB, status: 'complete' },
  ];
}

export function UploadFilesSelectableDemo() {
  const [files, setFiles] = useState<UploadFile[]>(initial);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        width: '100%',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }}>
        <UploadFiles
          theme="dark"
          selectable
          files={files}
          onRemoveSelected={(ids) =>
            setFiles((prev) => prev.filter((f) => !ids.includes(f.id)))
          }
          onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
          onRemoveAll={() => setFiles([])}
          onFilesSelected={(picked) =>
            setFiles((prev) => [
              ...prev,
              ...picked.map((f) => ({
                id: uid(),
                name: f.name,
                size: f.size || MB,
                status: 'complete' as const,
              })),
            ])
          }
        />
      </div>
      {files.length === 0 && (
        <button
          type="button"
          onClick={() => setFiles(initial())}
          style={{
            padding: '6px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.16)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.8)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Reset demo
        </button>
      )}
    </div>
  );
}
