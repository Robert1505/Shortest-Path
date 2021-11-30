import React, { useEffect, useState } from "react";
import "./App.css";
import Cell from "./Cell";
import { delay } from "./Helpers/delay";
import { floodFillRecursiveHelper } from "./Helpers/floodFillHelper";
import { Move } from "./Types";

export const dx = [-1, 0, 1, 0, -1, -1, 1, 1];
export const dy = [0, 1, 0, -1, -1, 1, 1, -1];

export const ROWS = 22;
export const COLUMNS = 61;

const START_X = 8;
const START_Y = 8;

export const END_X = 5;
export const END_Y = 5;

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
  const [shortestPath, setShortestPath] = useState<Move[]>([]);
  const [activeCells, setActiveCells] = useState<string[][]>([]);
  const [distanceMatrix, setDistanceMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const mat = [];
    const pMat = [];
    const aMat = [];
    const dMat = [];
    for (let i = 1; i <= ROWS; i++) {
      const row = [];
      const pRow = [];
      const aRow = [];
      const dRow = [];
      for (let j = 0; j < COLUMNS; j++) {
        row.push(CELL_TYPE.EMPTY);
        pRow.push(false);
        aRow.push("");
        dRow.push(10000000);
      }
      mat.push(row);
      pMat.push(pRow);
      aMat.push(aRow);
      dMat.push(dRow);
    }
    mat[START_X][START_Y] = CELL_TYPE.START;
    mat[END_X][END_Y] = CELL_TYPE.END;

    dMat[START_X][START_Y] = 0;

    setMatrix(mat);
    setPathMatrix(pMat);
    setActiveCells(aMat);
    setDistanceMatrix(dMat);
  }, []);

  useEffect(() => {
    if (moveHistory.length > 0) {
      simulatePath();
    }
  }, [moveHistory]);

  useEffect(() => {
    if (moveHistory.length > 0) {
      drawShortestPath();
    }
  }, [shortestPath]);

  const renderGrid = () => {
    return matrix.map((row: any, rowIndex: number) => {
      return (
        <div className="grid" key={`row-${rowIndex}`}>
          {row.map((cellType: CELL_TYPE, columnIndex: number) => (
            <Cell
              handleLeftClick={() => {
                const newMatrix = [...matrix];
                newMatrix[rowIndex][columnIndex] = CELL_TYPE.WALL;
                setMatrix(newMatrix);
              }}
              cellType={cellType}
              color={activeCells?.[rowIndex]?.[columnIndex]}
            />
          ))}
        </div>
      );
    });
  };

  const renderSimplePath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    const newMoveHistory: Move[] = [...moveHistory];
    if (START_Y > END_Y) {
      for (let i = START_Y; i >= END_Y; i--) {
        pMat[START_X][i] = true;
        newMoveHistory.push({ positionX: START_X, positionY: i });
      }
    } else {
      for (let i = START_Y; i <= END_Y; i++) {
        pMat[START_X][i] = true;
        newMoveHistory.push({ positionX: START_X, positionY: i });
      }
    }

    if (START_X > END_X) {
      for (let i = START_X; i >= END_X; i--) {
        pMat[i][END_Y] = true;
        newMoveHistory.push({ positionX: i, positionY: END_Y });
      }
    } else {
      for (let i = START_X; i <= END_X; i++) {
        pMat[i][END_Y] = true;
        newMoveHistory.push({ positionX: i, positionY: END_Y });
      }
    }

    setPathMatrix(pMat);
    setMoveHistory(newMoveHistory);
  };

  const renderDFSPath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    const newMoveHistory: Move[] = [...moveHistory];
    floodFillRecursiveHelper(pMat, START_X, START_Y, newMoveHistory, matrix);
    setPathMatrix(pMat);
    setMoveHistory(newMoveHistory);
  };

  const renderBFSPath = () => {
    let queue: Move[] = [];
    queue.push({ positionX: START_X, positionY: START_Y });

    const newMoveHistory: Move[] = [...moveHistory];
    const pMat: boolean[][] = [...pathMatrix];
    const newDistanceMatrix: number[][] = [...distanceMatrix];

    while (queue.length > 0 && !pMat[END_X][END_Y]) {
      let currentPosition: Move | undefined = queue.shift();

      if (!currentPosition) return;

      pMat[currentPosition.positionX][currentPosition.positionY] = true;
      newMoveHistory.push(currentPosition);

      for (let a = 0; a < 4; a++) {
        const newRow = currentPosition.positionX + dx[a];
        const newColumn = currentPosition.positionY + dy[a];

        if (
          newRow < 0 ||
          newRow >= ROWS ||
          newColumn < 0 ||
          newColumn >= COLUMNS
        )
          continue;

        if (pMat[newRow][newColumn]) continue;

        // Verificam pozitia de langa noi
        if (
          matrix[newRow][newColumn] !== CELL_TYPE.WALL &&
          !pMat[newRow][newColumn]
        ) {
          queue.push({ positionX: newRow, positionY: newColumn });
          distanceMatrix[newRow][newColumn] =
            distanceMatrix[currentPosition.positionX][
              currentPosition.positionY
            ] + 1;
        }
      }
    }
    setMoveHistory(newMoveHistory);
    setPathMatrix(pMat);
    setDistanceMatrix(newDistanceMatrix);
  };

  const resetPath = () => {
    const pMat: boolean[][] = [...pathMatrix];
    const newActiveCells = [...activeCells];
    for (let i = 0; i < ROWS; i++)
      for (let j = 0; j < COLUMNS; j++) {
        pMat[i][j] = false;
        newActiveCells[i][j] = "";
      }
    setMoveHistory([]);
    setPathMatrix(pMat);
    setActiveCells(newActiveCells);
  };

  const simulatePath = async () => {
    for (let i = 0; i < moveHistory.length; i++) {
      const newActiveCells = [...activeCells];
      await delay(500 / moveHistory.length).then(() => {
        newActiveCells[moveHistory[i].positionX][moveHistory[i].positionY] =
          "yellow";
      });
      setActiveCells(newActiveCells);
    }

    simulateSolution();
  };

  const simulateSolution = async () => {
    console.log("distance matrix", distanceMatrix);

    let currentPosition: Move = { positionX: END_X, positionY: END_Y };
    let solutionHistory: Move[] = [];

    solutionHistory.push(currentPosition);

    // Cat timp nu am ajuns la inceput
    while (
      !(
        currentPosition.positionX === START_X &&
        currentPosition.positionY === START_Y
      )
    ) {
      for (let i = 0; i < 4; i++) {
        let newPosition: Move = {
          positionX: currentPosition.positionX + dx[i],
          positionY: currentPosition.positionY + dy[i],
        };
        if (
          distanceMatrix[currentPosition.positionX][currentPosition.positionY] -
            1 ===
          distanceMatrix[newPosition.positionX][newPosition.positionY]
        ) {
          currentPosition = newPosition;
          solutionHistory.push({
            positionX: newPosition.positionX,
            positionY: newPosition.positionY,
          });
        }
      }
    }

    setShortestPath(solutionHistory);

    for (let i = 0; i < solutionHistory.length; i++) {
      console.log("move", solutionHistory[i]);
    }
  };

  const drawShortestPath = () => {

    const newActiveCells = [...activeCells];

    for(let i = 0; i < shortestPath.length; i++){
      newActiveCells[shortestPath[i].positionX][shortestPath[i].positionY] = "#E8EBF7";
    }

    setActiveCells(newActiveCells);
  };

  return (
    <div className="App">
      {renderGrid()}
      <button onClick={renderSimplePath}>SIMPLE PATH</button>
      <button onClick={renderDFSPath}>DFS PATH</button>
      <button onClick={renderBFSPath}>BFS PATH</button>
      <button onClick={resetPath}>RESET</button>
    </div>
  );
}

export default App;
