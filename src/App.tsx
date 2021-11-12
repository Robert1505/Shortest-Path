import React, { useEffect, useState } from "react";
import "./App.css";
import Cell from "./Cell";

const ROWS = 22;
const COLUMNS = 61;

const START_X = 12;
const START_Y = 0;

const END_X = 10;
const END_Y = 10;

export enum CELL_TYPE {
  EMPTY = 0,
  START = 1,
  END = 2,
  WALL = 3,
}

function App() {
  const [matrix, setMatrix] = useState<CELL_TYPE[][]>([]);
  const [pathMatrix, setPathMatrix] = useState<boolean[][]>([]);

  useEffect(() => {
    const mat = [];
    const pMat = [];
    for (let i = 1; i <= ROWS; i++) {
      const row = [];
      const pRow = [];
      for (let j = 0; j < COLUMNS; j++) {
        row.push(CELL_TYPE.EMPTY);
        pRow.push(false);
      }
      mat.push(row);
      pMat.push(pRow);
    }
    mat[START_X][START_Y] = CELL_TYPE.START;
    mat[END_X][END_Y] = CELL_TYPE.END;

    pMat[START_X][START_Y] = true;

    if (START_Y > END_Y) {
      for (let i = END_Y; i < START_Y; i++) pMat[START_X][i] = true;
    } else {
      for (let i = START_Y; i <= END_Y; i++) pMat[START_X][i] = true;
    }

    if(START_X > END_X){
      for (let i = END_X; i < START_X; i++) pMat[i][END_Y] = true;
    } else {
      for (let i = START_X; i <= END_X; i++) pMat[i][END_Y] = true;
    }

    setMatrix(mat);
    setPathMatrix(pMat);
  }, []);

  const renderGrid = () => {
    return matrix.map((row: any, rowIndex: number) => {
      return (
        <div className="grid" key={`row-${rowIndex}`}>
          {row.map((cellType: CELL_TYPE, columnIndex: number) => (
            <Cell
              cellType={cellType}
              isYellow={pathMatrix?.[rowIndex]?.[columnIndex]}
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div className="App">
      {renderGrid()}
      <button>START</button>
    </div>
  );
}

export default App;
