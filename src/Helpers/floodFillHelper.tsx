import { CELL_TYPE, COLUMNS, dx, dy, ROWS } from "../App";

export const floodFillRecursiveHelper = (
  squares: boolean[][],
  i: number,
  j: number
) => {
  // check out of bounds
  if (i < 0 || i >= ROWS) return 0;
  if (j < 0 || j >= COLUMNS) return 0;

  // check if it's visited
  if (squares[i][j]) return 0;
  // Indicate node has been visited
  squares[i][j] = true;

  for (let a = 0; a < 4; a++) {
    floodFillRecursiveHelper(squares, i + dx[a], j + dy[a]);
  }
};


/// TODO:
// 1. Sa se opreasca DFS la target
// 2. Sa trecem pe langa pereti