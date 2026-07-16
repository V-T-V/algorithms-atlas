// =============================================================================
// 运送盒子 · 纯算法实现（简化版）
// dp[i] = min(dp[j] + 2·distinctPorts(j..i-1))，约束：段长≤maxBoxes，不同港≤maxPorts。
// =============================================================================

export interface DeliverBoxesHooks {
  onFill?: (i: number, val: number) => void;
  onResult?: (trips: number) => void;
}

export function deliverBoxes(
  ports: readonly number[],
  maxBoxes: number,
  maxPorts: number,
  hooks: DeliverBoxesHooks = {},
): number {
  const n = ports.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = Infinity;
    const seen = new Set<number>();
    let count = 0;
    for (let j = i - 1; j >= 0 && i - j <= maxBoxes; j--) {
      if (!seen.has(ports[j]!)) {
        seen.add(ports[j]!);
        count++;
        if (count > maxPorts) break;
      }
      dp[i] = Math.min(dp[i]!, dp[j]! + 2 * count);
    }
    hooks.onFill?.(i, dp[i]!);
  }
  hooks.onResult?.(dp[n]!);
  return dp[n]!;
}
