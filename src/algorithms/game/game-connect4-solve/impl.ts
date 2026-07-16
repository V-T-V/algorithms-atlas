// =============================================================================
// Connect4 求解器 · 纯算法实现
// 棋盘 rows×cols，0=空 1=红(先手,最大化) 2=黄。重力下落。
// minimax 带深度限制：胜=±(大数-深度)。
// =============================================================================
export interface GameConnect4SolveHooks {
  onDrop?: (col: number, player: number) => void;
  onScore?: (col: number, value: number) => void;
}

const ROWS = 6;
const COLS = 7;
const DIRS: Array<[number, number]> = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function makeBoard(): number[][] {
  return Array.from({ length: ROWS }, () => new Array<number>(COLS).fill(0));
}

function cloneBoard(b: number[][]): number[][] {
  return b.map((row) => [...row]);
}

/** 检查在 落子后是否获胜（含该子）。 */
function winsAt(b: number[][], r: number, c: number, p: number): boolean {
  for (const [dr, dc] of DIRS) {
    let count = 1;
    for (const sign of [-1, 1]) {
      let rr = r + dr * sign;
      let cc = c + dc * sign;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && b[rr]![cc]! === p) {
        count++;
        rr += dr * sign;
        cc += dc * sign;
      }
    }
    if (count >= 4) return true;
  }
  return false;
}

/** 在列 col 为玩家 p 落子，返回落到的行号（-1 列满）。 */
function drop(b: number[][], col: number, p: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r]![col]! === 0) {
      b[r]![col]! = p;
      return r;
    }
  }
  return -1;
}

function minimax(
  b: number[][],
  depth: number,
  alpha: number,
  beta: number,
  isMax: boolean,
  lastR: number,
  lastC: number,
  lastP: number,
): number {
  // 上一步是否获胜
  if (winsAt(b, lastR, lastC, lastP)) {
    return lastP === 1 ? 1000 - (10 - depth) : -1000 + (10 - depth);
  }
  if (depth === 0) return 0;
  if (isMax) {
    let best = -Infinity;
    for (let c = 0; c < COLS; c++) {
      const r = drop(b, c, 1);
      if (r < 0) continue;
      best = Math.max(best, minimax(b, depth - 1, alpha, beta, false, r, c, 1));
      b[r]![c]! = 0;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best === -Infinity ? 0 : best; // 列满
  } else {
    let best = Infinity;
    for (let c = 0; c < COLS; c++) {
      const r = drop(b, c, 2);
      if (r < 0) continue;
      best = Math.min(best, minimax(b, depth - 1, alpha, beta, true, r, c, 2));
      b[r]![c]! = 0;
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best === Infinity ? 0 : best;
  }
}

export interface Connect4Result {
  bestCol: number;
  value: number;
}

export function gameConnect4Solve(
  board: ReadonlyArray<readonly number[]> = [],
  depth = 5,
  hooks: GameConnect4SolveHooks = {},
): Connect4Result {
  const b = board.length === 0 ? makeBoard() : cloneBoard(board as number[][]);
  let bestVal = -Infinity;
  let bestCol = 3; // 默认中间
  for (let c = 0; c < COLS; c++) {
    const r = drop(b, c, 1);
    if (r < 0) continue;
    hooks.onDrop?.(c, 1);
    const v = minimax(b, depth - 1, -Infinity, Infinity, false, r, c, 1);
    b[r]![c]! = 0;
    hooks.onScore?.(c, v);
    if (v > bestVal) {
      bestVal = v;
      bestCol = c;
    }
  }
  return { bestCol, value: bestVal === -Infinity ? 0 : bestVal };
}
