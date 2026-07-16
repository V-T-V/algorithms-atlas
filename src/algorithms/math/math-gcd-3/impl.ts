// =============================================================================
// 二元 GCD（Stein）
// =============================================================================

export interface SteinHooks {
  onStep?: (a: bigint, b: bigint, factor: bigint) => void;
  onDone?: (g: bigint) => void;
}

export function binaryGcd(a: number | bigint, b: number | bigint, hooks: SteinHooks = {}): bigint {
  let A = typeof a === 'bigint' ? a : BigInt(a);
  let B = typeof b === 'bigint' ? b : BigInt(b);
  if (A < 0n) A = -A;
  if (B < 0n) B = -B;
  if (A === 0n) {
    hooks.onDone?.(B);
    return B;
  }
  if (B === 0n) {
    hooks.onDone?.(A);
    return A;
  }
  let shift = 0n;
  while (((A | B) & 1n) === 0n) {
    A >>= 1n;
    B >>= 1n;
    shift++;
  }
  while ((A & 1n) === 0n) A >>= 1n;
  do {
    hooks.onStep?.(A, B, 1n << shift);
    while ((B & 1n) === 0n) B >>= 1n;
    if (A > B) {
      const t = A;
      A = B;
      B = t;
    }
    B -= A;
  } while (B !== 0n);
  const result = A << shift;
  hooks.onStep?.(A, 0n, result);
  hooks.onDone?.(result);
  return result;
}
