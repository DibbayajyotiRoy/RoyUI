'use client';

import { ProgressButton } from '@roy-ui/ui';

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 16,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Happy path: resolves after 2s, shows the check, reverts. */
export function ProgressButtonDemo() {
  return (
    <div style={row}>
      <ProgressButton
        onAction={() => sleep(2000)}
        progressLabel="Deploying…"
        successLabel="Deployed"
      >
        Deploy
      </ProgressButton>
    </div>
  );
}

/** Failure path: rejects after 2s, shows the cross, reverts. */
export function ProgressButtonErrorDemo() {
  return (
    <div style={row}>
      <ProgressButton
        onAction={async () => {
          await sleep(2000);
          throw new Error('deploy failed');
        }}
        progressLabel="Deploying…"
        errorLabel="Deploy failed"
      >
        Deploy (will fail)
      </ProgressButton>
    </div>
  );
}

/** resultDuration comparison: quick flag vs lingering flag. */
export function ProgressButtonDurationDemo() {
  return (
    <div style={row}>
      <ProgressButton
        onAction={() => sleep(1200)}
        progressLabel="Saving…"
        successLabel="Saved"
        resultDuration={800}
      >
        Save (flag 0.8s)
      </ProgressButton>
      <ProgressButton
        onAction={() => sleep(1200)}
        progressLabel="Saving…"
        successLabel="Saved"
        resultDuration={4000}
      >
        Save (flag 4s)
      </ProgressButton>
    </div>
  );
}
