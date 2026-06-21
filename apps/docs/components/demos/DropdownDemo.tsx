'use client';

import { useState } from 'react';
import { Dropdown } from '@roy-ui/ui';

type Theme = 'light' | 'dark' | 'auto';

/** The dark download circle that sits in the trigger's leading slot. */
const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
    <path
      d="M8 2.5v6.5m0 0L5.2 6.2M8 9l2.8-2.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3.5 11.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const exportOptions = [
  { label: 'Export as .pdf', value: 'pdf' },
  { label: 'Export as .csv', value: 'csv' },
  { label: 'Export as .xlsx', value: 'xlsx' },
];

export function ExportDropdownDemo({ theme = 'auto' }: { theme?: Theme }) {
  return (
    <Dropdown
      theme={theme}
      label="Export as"
      icon={<DownloadIcon />}
      aria-label="Export as"
      options={exportOptions}
      onChange={(v) => {
        // eslint-disable-next-line no-console
        console.log('export', v);
      }}
    />
  );
}

const roleOptions = [
  { label: 'Engineer', value: 'eng' },
  { label: 'Designer', value: 'design' },
  { label: 'Product', value: 'pm' },
  { label: 'Marketing', value: 'mkt' },
];

export function SelectDropdownDemo({ theme = 'dark' }: { theme?: Theme }) {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 260 }}>
      <Dropdown
        theme={theme}
        fullWidth
        aria-label="Role"
        placeholder="Choose a role"
        options={roleOptions}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
