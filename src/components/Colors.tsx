import * as React from 'react';
import Color from "./Color";

const Colors = () => {
  const highlightColorHex = '#F62997';

  return (
    <div className="bg-dark phone-screen row g-0 container-fluid">
      {[...Array(60)].map((value, index) => {
        return (
          <div key={index} className="col-2">
            <div className="d-flex h-100">
              <Color highlightColorHex={highlightColorHex} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Colors;