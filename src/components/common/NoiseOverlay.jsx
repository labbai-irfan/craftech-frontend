import React from 'react';

const NoiseOverlay = () => {
  return (
    <svg className="noise-grain fixed inset-0 w-screen h-screen pointer-events-none z-[9995] opacity-[0.038] mix-blend-overlay" aria-hidden="true">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
};

export default NoiseOverlay;
