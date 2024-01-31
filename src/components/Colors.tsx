import * as React from 'react';
import Color from "./Color";

const Colors = () => {
  const highlightColor = { red: 250, green: 50, blue: 50 };

  return (
    <div className="bg-dark phone-screen row g-0 container-fluid">
      {[...Array(36)].map((value, index) => {
        return (
          <div key={index} className="col-2">
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