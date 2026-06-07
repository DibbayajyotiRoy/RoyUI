'use client';

import { useEffect, useRef, useState } from 'react';
import { UploadFiles, type UploadFile, type UploadTheme } from '@roy-ui/ui';

const MB = 1024 * 1024;

let counter = 0;
const uid = () => `upl-${++counter}`;

function seed(): UploadFile[] {
  return [
    {
      id: uid(),
      name: 'investor-pitch-deck.pdf',
      size: 14 * MB,
      uploaded: 14 * MB,
      progress: 100,
      status: 'complete',
    },
    {
      id: uid(),
      name: 'landing-copy-update.docx',
      size: 4 * MB,
      uploaded: 2.7 * MB,
      progress: 68,
      status: 'uploading',
    },
    {
      id: uid(),
      name: 'product-ui-concepts.fig',
      size: 14 * MB,
      uploaded: 4.5 * MB,
      progress: 32,
      status: 'uploading',
    },
  ];
}

export function UploadFilesDemo({ theme = 'dark' }: { theme?: UploadTheme }) {
  const [files, setFiles] = useState<UploadFile[]>(seed);
  const rafReseed = useRef(false);

  // Tick the in-flight files toward 100% so the preview animates on its own.
  useEffect(() => {
    const id = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status !== 'uploading') return f;
          const step = (0.03 + Math.random() * 0.05) * f.size;
          const uploaded = Math.min(f.size, (f.uploaded ?? 0) + step);
          const progress = Math.round((uploaded / f.size) * 100);
          return progress >= 100
            ? { ...f, uploaded: f.size, progress: 100, status: 'complete' }
            : { ...f, uploaded, progress };
        }),
      );
    }, 700);
    return () => clearInterval(id);
  }, []);

  // Once everything finishes, gently restart so the demo keeps demoing.
  useEffect(() => {
    if (files.length > 0 && files.every((f) => f.status === 'complete')) {
      if (rafReseed.current) return;
      rafReseed.current = true;
      const t = setTimeout(() => {
        setFiles(seed());
        rafReseed.current = false;
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [files]);

  const addFiles = (picked: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...picked.map((file) => ({
        id: uid(),
        name: file.name,
        size: file.size || Math.round((1 + Math.random() * 12) * MB),
        uploaded: 0,
        progress: 0,
        status: 'uploading' as const,
      })),
    ]);
  };

  return (
    <UploadFiles
      theme={theme}
      files={files}
      onFilesSelected={addFiles}
      onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
      onRemoveAll={() => setFiles([])}
      onClose={() => setFiles(seed())}
      onAction={() => {}}
    />
  );
}
