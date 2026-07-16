// =============================================================================
// 完美井字棋 · 纯算法实现
// board: 9 格 0=空 1=X(先手) 2=O。minimax 求 X 视角最优价值与落子。
// =============================================================================
export interface GameTictactoePerfectHooks {
  onMove?: (cell: number, board: number[]) => void;
  onScore?: (value: number) => void;
}

const LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winner(board: number[]): number {
  for (const [a, b, c] of LINES) {
    const av = board[a]!;
    if (av !== 0 && av === board[b]! && av === board[c]!) return av;
  }
  return 0;
}

function full(board: number[]): boolean {
  return board.every((c) => c !== 0);
}

export interface TttResult {
  /** X 视角最优价值：+10 X 胜，-10 O 胜，0 平。 */
  value: number;
  /** 最优落子格（-1 表示已终局）。 */
  bestMove: number;
}

export function gameTictactoePerfect(
  board: number[],
  hooks: GameTictactoePerfectHooks = {},
): TttResult {
  // isMaxPlayer === true 表示轮到 X(1)，最大化
  const minimax = (b: number[], isMax: boolean, depth: number): number => {
    const w = winner(b);
    if (w === 1) return 10 - depth;
    if (w === 2) return depth - 10;
    if (full(b)) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i]! !== 0) continue;
        b[i]! = 1;
        hooks.onMove?.(i, b);
        best = Math.max(best, minimax(b, false, depth + 1));
        b[i]! = 0;
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i]! !== 0) continue;
        b[i]! = 2;
        hooks.onMove?.(i, b);
        best = Math.min(best, minimax(b, true, depth + 1));
        b[i]! = 0;
      }
      return best;
    }
  };

  // 求当前轮到谁：X 数量 ≤ O 数量则轮到 X
  let xCount = 0;
  let oCount = 0;
  for (const c of board) {
    if (c === 1) xCount++;
    else if (c === 2) oCount++;
  }
  const xTurn = xCount <= oCount;

  if (winner(board) !== 0 || full(board)) {
    const v = winner(board) === 1 ? 10 : winner(board) === 2 ? -10 : 0;
    hooks.onScore?.(v);
    return { value: v, bestMove: -1 };
  }

  let bestVal = xTurn ? -Infinity : Infinity;
  let bestMove = -1;
  const work = [...board];
  for (let i = 0; i < 9; i++) {
    if (work[i]! !== 0) continue;
    work[i]! = xTurn ? 1 : 2;
    const v = minimax(work, !xTurn, 0);
    work[i]! = 0;
    if (xTurn) {
      if (v > bestVal) {
        bestVal = v;
        bestMove = i;
      }
    } else {
      if (v < bestVal) {
        bestVal = v;
        bestMove = i;
      }
    }
  }
  hooks.onScore?.(bestVal);
  return { value: bestVal, bestMove };
}
