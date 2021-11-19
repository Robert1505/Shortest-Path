import { CELL_TYPE, COLUMNS, dx, dy, ROWS } from "../App";
import { Move } from "../Types";
import { END_X, END_Y } from "../App";

export const floodFillRecursiveHelper = (
  squares: boolean[][],
  i: number,
  j: number,
  moveHistory: Move[],
  matrix: CELL_TYPE[][]
) => {
  // check out of bounds
  if (i < 0 || i >= ROWS) return 0;
  if (j < 0 || j >= COLUMNS) return 0;

  // check if it's visited
  if (squares[i][j]) return 0;
  if (squares[END_X][END_Y]) return 0;
  // Indicate node has been visited
  squares[i][j] = true;
  moveHistory.push({ positionX: i, positionY: j });

  for (let a = 0; a < 4; a++) {
    const newRow = i + dx[a];
    const newColumn = j + dy[a];
    if (newRow < 0 || newRow >= ROWS || newColumn < 0 || newColumn >= COLUMNS)
      return 0;
      
    if (matrix[newRow][newColumn] !== CELL_TYPE.WALL)
      floodFillRecursiveHelper(squares, newRow, newColumn, moveHistory, matrix);
  }
};

/// TODO:
// 1. Sa se opreasca DFS la target
// 2. Sa trecem pe langa pereti
