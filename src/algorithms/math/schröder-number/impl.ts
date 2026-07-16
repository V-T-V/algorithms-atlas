// =============================================================================
// 大 Schröder 数 · 纯算法实现
// S(n) = S(n-1) + Σ_{k=0}^{n-1} S(k)·S(n-1-k)。BigInt。
// =============================================================================

/** 事件钩子。 */
export interface SchröderHooks {
  /** 计算 S(n)=v。 */
  onValue?: (n: number, value: bigint) => void;
  /** 完成。 */
  onDone?: (seq: bigint[]) => void;
}

/**
 * 计算大 Schröder 数 S(0..N)。
 */
export function schröder(N: number, hooks: SchröderHooks = {}): bigint[] {
  if (N < 0) throw new RangeError('schröder: N must be non-negative');
  const S = new Array<bigint>(N + 1).fill(0n);
  if (N >= 0) S[0] = 1n;
  for (let n = 1; n <= N; n++) {
    let v = S[n - 1]!;
    for (let k = 0; k <= n - 1; k++) {
      v += S[k]! * S[n - 1 - k]!;
    }
    S[n] = v;
    hooks.onValue?.(n, v);
  }
  hooks.onDone?.(S);
  return S;
}
