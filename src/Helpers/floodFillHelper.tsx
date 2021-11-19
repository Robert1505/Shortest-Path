import { CELL_TYPE, COLUMNS, dx, dy, ROWS } from "../App";
import { Move } from "../Types";
import { END_X, END_Y } from "../App";

export const floodFillRecursiveHelper = (
  squares: boolean[][],
  i: number,
  j: number,
  moveHistory: Move[]
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
    floodFillRecursiveHelper(squares, i + dx[a], j + dy[a], moveHistory);
  }
};

/// TODO:
// 1. Sa se opreasca DFS la target
// 2. Sa trecem pe langa pereti
