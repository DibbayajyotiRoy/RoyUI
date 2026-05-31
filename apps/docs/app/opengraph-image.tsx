import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Roy UI — Animated components for React.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0a0a0a',
          position: 'relative',
          padding: '96px',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
          color: 'white',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 188,
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.95,
            marginBottom: 32,
          }}
        >
          Roy UI
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: '#a3a3a3',
          }}
        >
          Animated components for React.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 96,
            right: 96,
            display: 'flex',
            fontSize: 26,
            fontWeight: 500,
            color: '#525252',
            letterSpacing: '0.02em',
          }}
        >
          roy-ui-docs.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
