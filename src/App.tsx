import React, { useEffect, useState } from "react";
import "./App.css";

const ROWS = 22;
const COLUMNS = 61;

const START_X = 0;
const START_Y = 0;

const END_X = 10;
const END_Y = 10;

enum CELL_TYPE {
  EMPTY = 0,
  START = 1,
  END = 2,
  WALL = 3,
}

function App() {
  const [matrix, setMatrix] = useState<CELL_TYPE[][]>([]);

  useEffect(() => {
    const mat = [];
    for (let i = 1; i <= ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLUMNS; j++) {
        row.push(CELL_TYPE.EMPTY);
      }
      mat.push(row);
    }
    mat[START_X][START_Y] = CELL_TYPE.START;
    mat[END_X][END_Y] = CELL_TYPE.END;

    setMatrix(mat);
  }, []);

  const renderGrid = () => {
    return matrix.map((row: any, rowIndex: number) => {
      return (
        <div className="grid" key={`row-${rowIndex}`}>
          {row.map((cell: CELL_TYPE) => {
            if (cell === CELL_TYPE.EMPTY) return <div></div>;
            if (cell === CELL_TYPE.START) return <div><i className="fas fa-chevron-right"></i></div>;
            if (cell === CELL_TYPE.END) return <div><i className="fas fa-bullseye"></i></div>;
            if (cell === CELL_TYPE.WALL) return <div><i className="fas fa-tree"></i></div>;
          })}
        </div>
      );
    });
  };

  return <div className="App">{renderGrid()}</div>;
}

export default App;
