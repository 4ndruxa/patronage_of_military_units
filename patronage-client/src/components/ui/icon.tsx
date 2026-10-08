import React from 'react';

// Line icons from the mockup sprite (mockups/v2), inline so no sprite has to be loaded.
const ICON_PATHS = {
  arrow: 'M5 12h14M12 5l7 7-7 7',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
};

export type IconName = keyof typeof ICON_PATHS;

const Icon: React.FC<{ name: IconName; className?: string }> = ({ name, className }) => (
  <svg className={`pm-i${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

export default Icon;
