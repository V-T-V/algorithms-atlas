// =============================================================================
// 状压 DP（Bitmask DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：旅行商问题 TSP（访问所有城市并回到起点的最短回路）。
// =============================================================================

/** TSP 输入：距离矩阵 dist[i][j]（不对称也可）。 */
export interface TspInput {
  /** dist[i][j] = 从城市 i 到 j 的距离；不可达记 Infinity。 */
  dist: number[][];
  /** 起点（默认 0）。 */
  start?: number;
}

/** 状压 DP 执行过程中的事件钩子。任一可选。 */
export interface BitmaskDpHooks {
  /** 开始计算某个状态 (mask, last) 的最优值。 */
  onState?: (mask: number, last: number) => void;
  /** 用前驱 (prev) 推进到 (mask, last)，候选值 candidate。 */
  onTransition?: (
    prevMask: number,
    prev: number,
    mask: number,
    last: number,
    candidate: number,
  ) => void;
  /** 一个状态 (mask, last) 已求出最优值 value。 */
  onSolve?: (mask: number, last: number, value: number) => void;
  /** 算法完成：最短回路长度与路径。 */
  onDone?: (best: number, path: number[]) => void;
}

/** TSP 结果。 */
export interface TspResult {
  /** 最短回路长度；不可行记 Infinity。 */
  best: number;
  /** 访问顺序（含回到起点），如 [0,2,1,3,0]。不可行返回 []。 */
  path: number[];
}

/**
 * 状压 DP 解 TSP（Held-Karp 算法）。
 *
 * 状态 `dp[mask][i]` = 已访问城市集合为 mask（mask 含 start 与 i）、当前位于 i 时的最小代价。
 *
 * 转移：枚举上一个城市 j（在 mask 中且 j≠i）：
 *   `dp[mask][i] = min over j ( dp[mask ^ (1<<i)][j] + dist[j][i] )`
 *
 * 终态：`min over i ( dp[full][i] + dist[i][start] )`，回溯路径。
 *
 * 复杂度 `O(2^n · n²)`，空间 `O(2^n · n)`。
 *
 * @param input TSP 输入
 * @param hooks 可选事件钩子
 * @returns 最短回路长度与访问顺序
 */
export function bitmaskDp(input: TspInput, hooks: BitmaskDpHooks = {}): TspResult {
  const dist = input.dist;
  const start = input.start ?? 0;
  const n = dist.length;
  if (n === 0) return { best: 0, path: [] };
  if (n === 1) return { best: 0, path: [start] };

  const full = (1 << n) - 1;
  const INF = Infinity;
  // dp[mask][i]
  const dp: number[][] = Array.from({ length: 1 << n }, () => new Array<number>(n).fill(INF));
  // 决策记录：prev[mask][i] = 上一个城市
  const prev: Array<Array<number>> = Array.from({ length: 1 << n }, () =>
    new Array<number>(n).fill(-1),
  );
  dp[1 << start]![start] = 0;
  hooks.onSolve?.(1 << start, start, 0);

  // 按 mask 中 1 的个数升序遍历（保证子集已算好）
  const masksByPopcount: number[][] = Array.from({ length: n + 1 }, () => []);
  for (let m = 0; m <= full; m++) masksByPopcount[popcount(m)]!.push(m);

  for (let size = 1; size <= n; size++) {
    for (const mask of masksByPopcount[size]!) {
      if (!(mask & (1 << start))) continue;
      for (let i = 0; i < n; i++) {
        if (!(mask & (1 << i))) continue;
        if (dp[mask]![i] === INF) continue;
        hooks.onState?.(mask, i);
        // 扩展到未访问城市 j
        for (let j = 0; j < n; j++) {
          if (mask & (1 << j)) continue;
          const w = dist[i]![j]!;
          if (!Number.isFinite(w)) continue;
          const nmask = mask | (1 << j);
          const cand = dp[mask]![i]! + w;
          hooks.onTransition?.(mask, i, nmask, j, cand);
          if (cand < dp[nmask]![j]!) {
            dp[nmask]![j] = cand;
            prev[nmask]![j] = i;
          }
        }
      }
    }
  }

  // 收尾：回到起点
  let best = INF;
  let bestLast = -1;
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(dist[i]![start]!)) continue;
    const cand = dp[full]![i]! + dist[i]![start]!;
    if (cand < best) {
      best = cand;
      bestLast = i;
    }
  }

  if (bestLast === -1) {
    hooks.onDone?.(INF, []);
    return { best: INF, path: [] };
  }

  // 回溯路径
  const path: number[] = [];
  let mask = full;
  let cur = bestLast;
  while (cur !== -1) {
    path.push(cur);
    const p = prev[mask]![cur]!;
    if (p === -1) break;
    mask ^= 1 << cur;
    cur = p;
  }
  path.reverse();
  path.push(start);
  hooks.onDone?.(best, path);
  return { best, path };
}

/** 数位 1 的个数。 */
function popcount(x: number): number {
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}
