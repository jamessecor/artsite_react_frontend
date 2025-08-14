// Colors.tsx
import * as React from 'react';
import { useMemo } from 'react';
import Color from './Color';
import './Colors.css';

const Colors: React.FC = () => {
  const highlightColor = '#F62997';

  // Generate initial colors when component mounts
  const colors = useMemo(() => {
    return Array.from({ length: 522 }, () =>
      `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
    );
  }, []);

  return (
    <div className="colors-grid">
      {colors.map((initialColor, index) => (
        <div key={index} className="color-container">
          <Color
            initialColor={initialColor}
            highlightColorHex={highlightColor}
          />
        </div>
      ))}
    </div>
  );
};

export default Colors;