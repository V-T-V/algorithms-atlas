// =============================================================================
// 整数划分 P(n) · 纯算法实现
// 五边形数定理：p(n)=Σ (−1)^(k+1)[p(n-g1)+p(n-g2)]，g1=k(3k−1)/2, g2=k(3k+1)/2。
// =============================================================================

/** 事件钩子。 */
export interface PartitionPHooks {
  /** 计算 p(n)=v。 */
  onValue?: (n: number, value: bigint) => void;
  /** 完成。 */
  onDone?: (seq: bigint[]) => void;
}

/**
 * 计算 p(0..N)。p(0)=1。
 */
export function partitionP(N: number, hooks: PartitionPHooks = {}): bigint[] {
  if (N < 0) throw new RangeError('partitionP: N must be non-negative');
  const p = new Array<bigint>(N + 1).fill(0n);
  p[0] = 1n;
  for (let n = 1; n <= N; n++) {
    let sum = 0n;
    // 五边形数定理累加
    for (let k = 1; ; k++) {
      const g1 = (k * (3 * k - 1)) / 2;
      const g2 = (k * (3 * k + 1)) / 2;
      if (g1 > n) break;
      const sign = k % 2 === 1 ? 1n : -1n;
      sum += sign * p[n - g1]!;
      if (g2 <= n) sum += sign * p[n - g2]!;
    }
    p[n] = sum;
    hooks.onValue?.(n, sum);
  }
  hooks.onDone?.(p);
  return p;
}
