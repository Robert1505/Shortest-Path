import React, { useEffect, useState } from "react";
import "./App.css";
import Cell from "./Cell";
import { delay } from "./Helpers/delay";
import { floodFillRecursiveHelper } from "./Helpers/floodFillHelper";
import {Move} from './Types';

export const dx = [-1, 0, 1, 0, -1, -1, 1, 1];
export const dy = [0, 1, 0, -1, -1, 1, 1, -1];

export const ROWS = 22;
export const COLUMNS = 61;

const START_X = 12;
const START_Y = 24;

export const END_X = 5;
export const END_Y = 40;

export enum CELL_TYPE {
  EMPTY = 0,
  START = 1,
  END = 2,
  WALL = 3,
}

function App() {
  const [matrix, setMatrix] = useState<CELL_TYPE[][]>([]);
  const [pathMatrix, setPathMatrix] = useState<boolean[][]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]); /// [{2, 3}, {2, 4}, {2, 5}] moveHistory.push()
  const [activeCells, setActiveCells] = useState<boolean[][]>([]);

  useEffect(() => {
    const mat = [];
    const pMat = [];
    const aMat = [];
    for (let i = 1; i <= ROWS; i++) {
      const row = [];
      const pRow = [];
      const aRow = [];
      for (let j = 0; j < COLUMNS; j++) {
        row.push(CELL_TYPE.EMPTY);
        pRow.push(false);
        aRow.push(false);
      }
      mat.push(row);
      pMat.push(pRow);
      aMat.push(aRow);
    }
    mat[START_X][START_Y] = CELL_TYPE.START;
    mat[END_X][END_Y] = CELL_TYPE.END;

    setMatrix(mat);
    setPathMatrix(pMat);
    setActiveCells(aMat);
  }, []);

  useEffect(() => {
    if (moveHistory.length > 0) {
      simulatePath();
    }
  }, [moveHistory])

  const renderGrid = () => {
    return matrix.map((row: any, rowIndex: number) => {
      return (
        <div className="grid" key={`row-${rowIndex}`}>
          {row.map((cellType: CELL_TYPE, columnIndex: number) => (
            <Cell
              cellType={cellType}
              isYellow={activeCells?.[rowIndex]?.[columnIndex]}
            />
          ))}
        </div>
      );
    });
  };

  const renderSimplePath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    const newMoveHistory : Move[] = [...moveHistory];
    if (START_Y > END_Y) {
      for (let i = START_Y; i >= END_Y; i--) {
        pMat[START_X][i] = true;
        newMoveHistory.push({positionX: START_X, positionY: i})
      }
    } else {
      for (let i = START_Y; i <= END_Y; i++) {
        pMat[START_X][i] = true;
        newMoveHistory.push({positionX: START_X, positionY: i})
      }
    }

    if (START_X > END_X) {
      for (let i = START_X; i >= END_X; i--) {
        pMat[i][END_Y] = true;
        newMoveHistory.push({positionX: i, positionY: END_Y})
      } 
    } else {
      for (let i = START_X; i <= END_X; i++) {
        pMat[i][END_Y] = true;
        newMoveHistory.push({positionX: i, positionY: END_Y})
      } 
    }

    setPathMatrix(pMat);
    setMoveHistory(newMoveHistory);
  };

  const renderDFSPath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    const newMoveHistory : Move[] = [...moveHistory];
    floodFillRecursiveHelper(pMat, START_X, START_Y, newMoveHistory);
    setPathMatrix(pMat);
    setMoveHistory(newMoveHistory);
  };

  const resetPath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLUMNS; j++) pMat[i][j] = false;
    setPathMatrix(pMat);
  };

  const simulatePath = async () => {
    for(let i = 0; i < moveHistory.length; i++){
      const newActiveCells = [...activeCells];
      await delay(500 / moveHistory.length).then(() => {
        newActiveCells[moveHistory[i].positionX][moveHistory[i].positionY] = true;
      })
      setActiveCells(newActiveCells);
    }
  }

  return (
    <div className="App">
      {renderGrid()}
      <button onClick={renderSimplePath}>SIMPLE PATH</button>
      <button onClick={renderDFSPath}>DFS PATH</button>
      <button onClick={resetPath}>RESET</button>
    </div>
  );
}

export default App;
