import * as React from 'react';
import Color from "./Color";

const Colors = () => {
  const highlightColor = { r: 200, g: 200, b: 0 };

  return (
    <div
      className={'fixed-top'}
      style={{ zIndex: 200 }}
    >
      <div className="row vh-100 g-0 container-fluid">
        {[...Array(108)].map((value, index) => {
          return (
            <div key={index} className="col-1">
              <div className="d-flex h-100">
                <Color key={`color-a-${index}`} highlightColor={highlightColor} />
                <Color key={`color-b-${index}`} highlightColor={highlightColor} />
                <Color key={`color-c-${index}`} highlightColor={highlightColor} />
                <Color key={`color-d-${index}`} highlightColor={highlightColor} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Colors;