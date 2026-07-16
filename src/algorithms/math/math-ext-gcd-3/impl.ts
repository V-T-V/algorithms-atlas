// =============================================================================
// 扩展欧几里得（迭代）
// =============================================================================

export interface ExtGcdHooks {
  onStep?: (a: bigint, b: bigint, q: bigint, x: bigint, y: bigint) => void;
  onDone?: (g: bigint, x: bigint, y: bigint) => void;
}

export interface ExtGcdResult {
  g: bigint;
  x: bigint;
  y: bigint;
}

export function extGcdIter(
  a: number | bigint,
  b: number | bigint,
  hooks: ExtGcdHooks = {},
): ExtGcdResult {
  let A = typeof a === 'bigint' ? a : BigInt(a);
  let B = typeof b === 'bigint' ? b : BigInt(b);
  if (A < 0n) A = -A;
  if (B < 0n) B = -B;
  let oldR = A;
  let r = B;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  while (r !== 0n) {
    const q = oldR / r;
    hooks.onStep?.(oldR, r, q, oldS - q * s, oldT - q * t);
    const newR = oldR - q * r;
    oldR = r;
    r = newR;
    const newS = oldS - q * s;
    oldS = s;
    s = newS;
    const newT = oldT - q * t;
    oldT = t;
    t = newT;
  }
  hooks.onDone?.(oldR, oldS, oldT);
  return { g: oldR, x: oldS, y: oldT };
}
