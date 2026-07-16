// =============================================================================
// 快递员区间 DP
// 数轴上 n 个已排序的点 positions[0..n-1]，起点 start。
// 求访问所有点的最小总路程。
// 状态：dp[i][j][0/1] = 已访问区间 [i,j]、当前在 i(0) 或 j(1)，访问完 [0,n-1] 还需最小路程。
// 终态：i==j==? 实际倒推：当区间 [i,j] == [0,n-1] 时剩余 0。
// 初始：快递员从 start 出发，先把区间张到包含 start 的状态不好；改为正向：
//   记 f[i][j][0/1] = 已完成 [i,j]、停在端点，已完成这部分走过的路程最小值。
//   终态需 i==0 且 j==n-1。
// 我们采用「覆盖区间 DP」：从单点 start 扩张。
// =============================================================================

export interface DeliveryInput {
  /** 已排序的位置数组。 */
  positions: readonly number[];
  /** 起点位置（必为 positions 中某个值，或独立坐标）。 */
  start: number;
}

export interface DeliveryHooks {
  onExpand?: (i: number, j: number, side: 0 | 1, dist: number) => void;
  onResult?: (minDist: number) => void;
}

export interface DeliveryResult {
  minDist: number;
}

export function deliveryCourier(input: DeliveryInput, hooks: DeliveryHooks = {}): DeliveryResult {
  const { positions, start } = input;
  const n = positions.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return { minDist: 0 };
  }
  if (n === 1) {
    hooks.onResult?.(0);
    return { minDist: 0 };
  }

  const INF = Infinity;
  // f[i][j][s]：已覆盖区间 [i,j]、停在 s 端(0=左 i, 1=右 j) 时已走的最小路程
  const f: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [INF, INF]),
  );

  // 初始：找最接近 start 的位置作为种子点。简化：必须从某个 positions[k] 开始扩展。
  // 这里取距离 start 最近的 positions[k]。
  let seed = 0;
  let best = Infinity;
  for (let k = 0; k < n; k++) {
    const d = Math.abs(positions[k]! - start);
    if (d < best) {
      best = d;
      seed = k;
    }
  }
  f[seed]![seed]![0] = best;
  f[seed]![seed]![1] = best;
  hooks.onExpand?.(seed, seed, 0, best);
  hooks.onExpand?.(seed, seed, 1, best);

  // 区间长度从 1 扩张
  for (let len = 1; len < n; len++) {
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      const fij0 = f[i]![j]!;
      const fij1 = f[i]![j]!;
      // f[i][j][0]（停在 i）：来自 f[i+1][j] 端点走到 i
      const fromR0 = f[i + 1]![j]![0]!;
      const fromR1 = f[i + 1]![j]![1]!;
      if (fromR0 < INF) {
        const cost = fromR0 + (positions[i + 1]! - positions[i]!);
        if (cost < fij0[0]!) fij0[0] = cost;
      }
      if (fromR1 < INF) {
        const cost = fromR1 + (positions[j]! - positions[i]!);
        if (cost < fij0[0]!) fij0[0] = cost;
      }
      // f[i][j][1]（停在 j）：来自 f[i][j-1] 端点走到 j
      const fromL1 = f[i]![j - 1]![1]!;
      const fromL0 = f[i]![j - 1]![0]!;
      if (fromL1 < INF) {
        const cost = fromL1 + (positions[j]! - positions[j - 1]!);
        if (cost < fij1[1]!) fij1[1] = cost;
      }
      if (fromL0 < INF) {
        const cost = fromL0 + (positions[j]! - positions[i]!);
        if (cost < fij1[1]!) fij1[1] = cost;
      }
      hooks.onExpand?.(i, j, 0, fij0[0]!);
      hooks.onExpand?.(i, j, 1, fij1[1]!);
    }
  }

  const minDist = Math.min(f[0]![n - 1]![0]!, f[0]![n - 1]![1]!);
  hooks.onResult?.(minDist);
  return { minDist };
}
