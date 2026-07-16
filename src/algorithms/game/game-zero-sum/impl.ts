// =============================================================================
// 零和博弈框架 · 纯算法实现
// 求两人零和矩阵博弈的纯策略鞍点。payoff[i][j] 为行玩家收益。
// =============================================================================
export interface GameZeroSumHooks {
  onRowMin?: (row: number, minVal: number) => void;
  onColMax?: (col: number, maxVal: number) => void;
  onConclude?: (hasSaddle: boolean, value: number) => void;
}

export interface ZeroSumResult {
  hasSaddle: boolean;
  value: number;
  rowStrategy: number;
  colStrategy: number;
}

export function gameZeroSum(
  payoff: ReadonlyArray<readonly number[]>,
  hooks: GameZeroSumHooks = {},
): ZeroSumResult {
  const m = payoff.length;
  const n = payoff[0]?.length ?? 0;

  // maximin（行玩家）：每行取最小，再取最大
  let maximin = -Infinity;
  let rowStrategy = 0;
  for (let i = 0; i < m; i++) {
    let rowMin = Infinity;
    for (let j = 0; j < n; j++) rowMin = Math.min(rowMin, payoff[i]![j]!);
    hooks.onRowMin?.(i, rowMin);
    if (rowMin > maximin) {
      maximin = rowMin;
      rowStrategy = i;
    }
  }

  // minimax（列玩家）：每列取最大，再取最小
  let minimax = Infinity;
  let colStrategy = 0;
  for (let j = 0; j < n; j++) {
    let colMax = -Infinity;
    for (let i = 0; i < m; i++) colMax = Math.max(colMax, payoff[i]![j]!);
    hooks.onColMax?.(j, colMax);
    if (colMax < minimax) {
      minimax = colMax;
      colStrategy = j;
    }
  }

  const hasSaddle = maximin === minimax;
  const value = hasSaddle ? maximin : (maximin + minimax) / 2;
  hooks.onConclude?.(hasSaddle, value);
  return { hasSaddle, value, rowStrategy, colStrategy };
}
