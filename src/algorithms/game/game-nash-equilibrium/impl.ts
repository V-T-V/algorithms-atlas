// =============================================================================
// 混合策略纳什均衡（2x2）· 纯算法实现
// 对双矩阵博弈 [row][i][j] / [col][i][j]：
//   行玩家概率 p（选行 0），使列玩家两列期望相等：
//     p*col[0][0] + (1-p)*col[1][0] = p*col[0][1] + (1-p)*col[1][1]
//   列玩家概率 q（选列 0），使行玩家两行期望相等。
// =============================================================================
export interface NashMixedHooks {
  onSolve?: (p: number, q: number) => void;
  onConclude?: (rowValue: number, colValue: number) => void;
}

export interface NashMixedResult {
  p: number; // 行玩家选行0的概率
  q: number; // 列玩家选列0的概率
  rowValue: number;
  colValue: number;
  valid: boolean;
}

export function gameNashEquilibrium(
  row: ReadonlyArray<readonly number[]>,
  col: ReadonlyArray<readonly number[]>,
  hooks: NashMixedHooks = {},
): NashMixedResult {
  const a = row[0]![0]!;
  const b = row[0]![1]!;
  const c = row[1]![0]!;
  const d = row[1]![1]!;
  const e = col[0]![0]!;
  const f = col[0]![1]!;
  const g = col[1]![0]!;
  const h = col[1]![1]!;
  // 列玩家无差异 → 求 p： p*e+(1-p)*g == p*f+(1-p)*h
  const denomP = e - g - (f - h);
  // 行玩家无差异 → 求 q： q*a+(1-q)*b == q*c+(1-q)*d
  const denomQ = a - b - (c - d);
  let p = 0.5;
  let q = 0.5;
  let valid = true;
  if (Math.abs(denomP) < 1e-12) valid = false;
  else p = (h - g) / denomP;
  if (Math.abs(denomQ) < 1e-12) valid = false;
  else q = (d - b) / denomQ;
  if (p < -1e-9 || p > 1 + 1e-9 || q < -1e-9 || q > 1 + 1e-9) valid = false;
  p = Math.max(0, Math.min(1, p));
  q = Math.max(0, Math.min(1, q));
  hooks.onSolve?.(p, q);
  // 行玩家期望值（对手以 q 混合，行玩家无差异时两行期望相等）
  const rowValue = q * a + (1 - q) * b;
  const colValue = p * e + (1 - p) * g;
  hooks.onConclude?.(rowValue, colValue);
  return { p, q, rowValue, colValue, valid };
}
