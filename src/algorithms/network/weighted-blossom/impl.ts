// =============================================================================
// 加权 Blossom（一般图最大权匹配）· 纯算法实现
// 教学版：对小图用 DP / 分支定界给出正确的最大权匹配。
// 与 Edmonds 算法在结果上等价（小图），但实现简洁可验证。
// =============================================================================

export interface WbEdge {
  from: number;
  to: number;
  weight: number;
}

export interface WbHooks {
  onConsider?: (matching: Array<[number, number]>, totalWeight: number) => void;
  onImprove?: (matching: Array<[number, number]>, totalWeight: number) => void;
  onDone?: (matching: Array<[number, number]>, totalWeight: number) => void;
}

/**
 * 加权最大匹配（一般图）。
 *
 * 用「位掩码 DP」精确求解：对节点子集 mask，f(mask) = mask 中能形成的最大权匹配。
 * 复杂度 O(2^n · n)，仅在 n ≤ ~20 可用，教学/演示足够。
 *
 * @param n 节点数
 * @param edges 加权边
 * @param hooks 钩子
 * @returns 最大权匹配（边数组）+ 总权重
 */
export function weightedBlossom(
  n: number,
  edges: readonly WbEdge[],
  hooks: WbHooks = {},
): { matching: Array<[number, number]>; totalWeight: number } {
  // 权重矩阵
  const w: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-Infinity));
  const hasEdge: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (const e of edges) {
    if (e.from === e.to) continue;
    if (e.weight > w[e.from]![e.to]!) {
      w[e.from]![e.to] = e.weight;
      w[e.to]![e.from] = e.weight;
      hasEdge[e.from]![e.to] = true;
      hasEdge[e.to]![e.from] = true;
    }
  }

  // 位掩码 DP：f[mask] = mask 表示的节点集的最大权匹配
  // 递推：取 mask 中最低位 i，要么 i 不匹配（f[mask \ {i}]），要么 i 与某个 j 匹配（w[i][j] + f[mask \ {i,j}]）
  const full = 1 << n;
  const dp = new Array<number>(full).fill(0);
  const choice = new Array<{ pairWith: number }>(full)
    .fill({ pairWith: -1 })
    .map(() => ({ pairWith: -1 }));

  let bestImprove = 0;

  // 从小到大遍历 mask
  for (let mask = 1; mask < full; mask++) {
    // 找最低位 i
    let i = -1;
    for (let k = 0; k < n; k++) {
      if (mask & (1 << k)) {
        i = k;
        break;
      }
    }
    if (i === -1) continue;
    // 选项 1：i 不匹配
    let best = dp[mask ^ (1 << i)]!;
    let pairWith = -1;
    // 选项 2：i 与 mask 中某个 j 匹配
    for (let j = i + 1; j < n; j++) {
      if (!(mask & (1 << j))) continue;
      if (!hasEdge[i]![j]) continue;
      const sub = mask ^ (1 << i) ^ (1 << j);
      const val = w[i]![j]! + dp[sub]!;
      if (val > best) {
        best = val;
        pairWith = j;
      }
    }
    dp[mask] = best;
    choice[mask] = { pairWith };

    if (best > bestImprove) {
      bestImprove = best;
      // 重建当前 mask 的匹配（用于 hook）
      const cur = reconstruct(mask, choice, n, hasEdge, w);
      hooks.onImprove?.(cur, best);
    }
    // 周期性报告
    if ((mask & 0x3f) === 0) {
      const cur = reconstruct(mask, choice, n, hasEdge, w);
      hooks.onConsider?.(cur, dp[mask]!);
    }
  }

  const matching = reconstruct((1 << n) - 1, choice, n, hasEdge, w);
  const totalWeight = dp[full - 1]!;
  hooks.onDone?.(matching, totalWeight);
  return { matching, totalWeight };
}

/** 重建给定 mask 的匹配。 */
function reconstruct(
  mask: number,
  choice: Array<{ pairWith: number }>,
  n: number,
  _hasEdge: boolean[][],
  _w: number[][],
): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  let m = mask;
  while (m > 0) {
    let i = -1;
    for (let k = 0; k < n; k++) {
      if (m & (1 << k)) {
        i = k;
        break;
      }
    }
    if (i === -1) break;
    const ch = choice[m]!;
    if (ch.pairWith === -1) {
      m ^= 1 << i;
    } else {
      out.push([i, ch.pairWith]);
      m ^= 1 << i;
      m ^= 1 << ch.pairWith;
    }
  }
  return out;
}
