import React, { useState } from "react";
import "./App.css";

const ROWS = 22;
const COLUMNS = 61;

function App() {
  const [matrix, setMatrix] = useState(
    Array(ROWS).fill(Array(COLUMNS).fill(0))
  );

  const renderGrid = () => {
    return matrix.map((row: any, rowIndex: number) => {
      return (
        <div className="grid" key={`row-${rowIndex}`}>
          {row.map((cell: number) => {
            return <div></div>;
          })}
        </div>
      );
    });
  };

  return <div className="App">{renderGrid()}</div>;
}

export default App;
