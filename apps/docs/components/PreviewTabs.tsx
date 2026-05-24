'use client';

import { useState, type ReactNode } from 'react';

export function PreviewTabs({
  preview,
  code,
  stretchPreview = false,
  overflowVisible = false,
}: {
  preview: ReactNode;
  code: ReactNode;
  stretchPreview?: boolean;
  overflowVisible?: boolean;
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');

  return (
    <div>
      <div className="tabs">
        <div className="tabs__list" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'preview'}
            data-state={tab === 'preview' ? 'active' : 'inactive'}
            className="tabs__trigger"
            onClick={() => setTab('preview')}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'code'}
            data-state={tab === 'code' ? 'active' : 'inactive'}
            className="tabs__trigger"
            onClick={() => setTab('code')}
          >
            Code
          </button>
        </div>
      </div>

      <div data-state={tab === 'preview' ? 'active' : 'inactive'} className="tabs__content">
        <div
          className={`example__preview ${stretchPreview ? 'example__preview--stretch' : ''} ${overflowVisible ? 'example__preview--overflow' : ''}`}
        >
          {preview}
        </div>
      </div>
      <div data-state={tab === 'code' ? 'active' : 'inactive'} className="tabs__content">
        {code}
      </div>
    </div>
  );
}
