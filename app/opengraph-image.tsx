import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Coeus Review & Training Specialist, Inc.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1e3a8a',
          backgroundImage: 'linear-gradient(45deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            Coeus Review & Training
          </h1>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 'normal',
              marginBottom: '30px',
              opacity: 0.9,
            }}
          >
            Specialist, Inc.
          </h2>
          <p
            style={{
              fontSize: '24px',
              opacity: 0.8,
              maxWidth: '800px',
              lineHeight: '1.4',
            }}
          >
            Premier Review Center for Criminology & Nursing • CPD Seminars • Professional Excellence
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}