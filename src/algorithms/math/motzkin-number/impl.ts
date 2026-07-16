// =============================================================================
// Motzkin 数 · 纯算法实现
// M(n) = M(n-1) + Σ M(k)·M(n-2-k)。BigInt。
// =============================================================================

/** 事件钩子。 */
export interface MotzkinHooks {
  /** 计算 M(n)=v。 */
  onValue?: (n: number, value: bigint) => void;
  /** 完成。 */
  onDone?: (seq: bigint[]) => void;
}

/**
 * 计算 M(0..N)。
 * @returns 长度 N+1 的数组
 */
export function motzkin(N: number, hooks: MotzkinHooks = {}): bigint[] {
  if (N < 0) throw new RangeError('motzkin: N must be non-negative');
  const M = new Array<bigint>(N + 1).fill(0n);
  if (N >= 0) M[0] = 1n;
  if (N >= 1) M[1] = 1n;
  for (let n = 2; n <= N; n++) {
    let v = M[n - 1]!;
    for (let k = 0; k <= n - 2; k++) {
      v += M[k]! * M[n - 2 - k]!;
    }
    M[n] = v;
    hooks.onValue?.(n, v);
  }
  hooks.onDone?.(M);
  return M;
}
