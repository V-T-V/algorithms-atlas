// =============================================================================
// 青蛙跳石头（经典 DP）· 纯算法实现
// 第 i 块石头有代价（或高度）cost[i]，青蛙从第 0 块出发，可跳 1 或 2 块，
// 求到达第 n-1 块的最小总代价（踩到的石头累计代价）。
// dp[i] = min(dp[i-1], dp[i-2]) + cost[i]；dp[0]=cost[0]。
// 与「最小代价爬楼梯」不同：本题为从 0 出发必须到达末块，且踩到即付费。
// =============================================================================

export interface FrogHooks {
  onStep?: (i: number, val: number) => void;
  onResult?: (total: number, path: number[]) => void;
}

export function frogJump(
  cost: readonly number[],
  hooks: FrogHooks = {},
): { total: number; path: number[] } {
  const n = cost.length;
  if (n === 0) {
    hooks.onResult?.(0, []);
    return { total: 0, path: [] };
  }
  if (n === 1) {
    hooks.onStep?.(0, cost[0]!);
    hooks.onResult?.(cost[0]!, [0]);
    return { total: cost[0]!, path: [0] };
  }
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = cost[0]!;
  dp[1] = cost[1]!;
  hooks.onStep?.(0, dp[0]);
  hooks.onStep?.(1, dp[1]);
  for (let i = 2; i < n; i++) {
    dp[i] = Math.min(dp[i - 1]!, dp[i - 2]!) + cost[i]!;
    hooks.onStep?.(i, dp[i]!);
  }
  // 回溯路径
  const path: number[] = [n - 1];
  let i = n - 1;
  while (i >= 2) {
    if (dp[i - 1]! <= dp[i - 2]!) {
      path.unshift(i - 1);
      i -= 1;
    } else {
      path.unshift(i - 2);
      i -= 2;
    }
  }
  if (i === 1 && path[0] !== 0) path.unshift(0);
  else if (i === 0 && path[0] !== 0) path.unshift(0);
  path.sort((a, b) => a - b);
  // 去重相邻
  const dedup: number[] = [];
  for (const p of path) if (dedup[dedup.length - 1] !== p) dedup.push(p);
  hooks.onResult?.(dp[n - 1]!, dedup);
  return { total: dp[n - 1]!, path: dedup };
}
