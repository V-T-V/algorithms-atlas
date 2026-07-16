// 随机博弈 · 实现（单状态自环 + γ 折扣，求矩阵博弈值的不动点）
// 收益矩阵 A（行玩家），状态自环：V = val(A + γ·V·ones)
// 不动点：V = (max_row min_col (A + γV)) = max_i min_j A[i][j] + γV
//   => V*(1-γ) = max_i min_j A[i][j] => V* = (max_i min_j A[i][j]) / (1-γ)
export interface StochasticGameHooks {
  onIter?: (iter: number, V: number) => void;
  onConclude?: (Vstar: number) => void;
}
export interface StochasticGameResult {
  value: number;
  iterations: number;
}
export function gameStochasticGame(
  A: ReadonlyArray<readonly number[]>,
  gamma: number,
  maxIter = 1000,
  tol = 1e-9,
  hooks: StochasticGameHooks = {},
): StochasticGameResult {
  if (gamma <= 0 || gamma >= 1) throw new Error('gamma 必须 ∈ (0,1)');
  // maximin of A
  let maximin = -Infinity;
  for (const row of A) {
    let rowMin = Infinity;
    for (const v of row) rowMin = Math.min(rowMin, v);
    maximin = Math.max(maximin, rowMin);
  }
  let V = maximin;
  let iterations = 0;
  for (let it = 1; it <= maxIter; it++) {
    iterations = it;
    const next = maximin + gamma * V;
    hooks.onIter?.(it, next);
    if (Math.abs(next - V) < tol) {
      V = next;
      break;
    }
    V = next;
  }
  hooks.onConclude?.(V);
  return { value: V, iterations };
}
