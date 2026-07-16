// =============================================================================
// 青蛙跳石头·困难版
// h[i] 为第 i 块石头费用；每次最多跳 maxJump 步；求 0→n-1 最小总费用。
// dp[i] = h[i] + min(dp[j]) for j in [max(0, i-maxJump), i-1]
// =============================================================================

export interface FrogHardHooks {
  onStep?: (i: number, val: number, fromIndex: number) => void;
  onResult?: (total: number, path: number[]) => void;
}

export interface FrogHardInput {
  /** 各石头费用。 */
  cost: readonly number[];
  /** 单次最大跳跃步数（>=1）。 */
  maxJump: number;
}

export interface FrogHardResult {
  total: number;
  path: number[];
  dp: number[];
}

export function frogJumpHard(input: FrogHardInput, hooks: FrogHardHooks = {}): FrogHardResult {
  const { cost, maxJump } = input;
  const n = cost.length;
  if (n === 0) {
    hooks.onResult?.(0, []);
    return { total: 0, path: [], dp: [] };
  }
  if (maxJump < 1) throw new Error('maxJump 必须 >= 1');

  const dp = new Array<number>(n).fill(Infinity);
  const from = new Array<number>(n).fill(-1);
  dp[0] = cost[0]!;
  hooks.onStep?.(0, dp[0], -1);

  for (let i = 1; i < n; i++) {
    const lo = Math.max(0, i - maxJump);
    let bestVal = Infinity;
    let bestJ = -1;
    for (let j = lo; j < i; j++) {
      if (dp[j]! < bestVal) {
        bestVal = dp[j]!;
        bestJ = j;
      }
    }
    dp[i] = bestVal + cost[i]!;
    from[i] = bestJ;
    hooks.onStep?.(i, dp[i]!, bestJ);
  }

  // 回溯路径
  const path: number[] = [];
  let cur = n - 1;
  while (cur !== -1) {
    path.unshift(cur);
    cur = from[cur]!;
  }

  hooks.onResult?.(dp[n - 1]!, path);
  return { total: dp[n - 1]!, path, dp };
}
