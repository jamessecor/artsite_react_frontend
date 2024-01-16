import * as React from 'react';
import Color from "./Color";

const Colors = () => {
  const highlightColor = { r: 200, g: 200, b: 255 };

  return (
    <div className="bg-dark phone-screen row g-0 container-fluid">
      {[...Array(264)].map((value, index) => {
        return (
          <div key={index} className="col-1">
            <div className="d-flex h-100">
              <Color key={`color-${index}`} highlightColor={highlightColor} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Colors;