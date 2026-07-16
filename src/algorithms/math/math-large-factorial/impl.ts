// =============================================================================
// 大数阶乘 · BigInt
// =============================================================================

export interface LargeFactorialHooks {
  onStep?: (i: number, current: bigint) => void;
}

export function largeFactorial(n: number, hooks: LargeFactorialHooks = {}): bigint {
  let result = 1n;
  const ni = Math.max(0, Math.floor(n));
  for (let i = 1; i <= ni; i++) {
    result *= BigInt(i);
    hooks.onStep?.(i, result);
  }
  return result;
}
