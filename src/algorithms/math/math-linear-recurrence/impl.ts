// =============================================================================
// 线性递推 · 矩阵快速幂（模 MOD）
// =============================================================================

const MOD = 1_000_000_007n;

export interface LinearRecurrenceHooks {
  onMultiply?: (step: number) => void;
}

export interface RecurrenceInput {
  /** 系数 c_1..c_k，使得 a_n = c_1·a_{n-1} + ... + c_k·a_{n-k} */
  coefs: number[];
  /** 初值 a_0..a_{k-1} */
  seeds: number[];
}

function modSafe(x: bigint, m: bigint): bigint {
  const r = x % m;
  return r < 0n ? r + m : r;
}

function matMul(a: bigint[][], b: bigint[][], m: bigint = MOD): bigint[][] {
  const n = a.length;
  const p = b[0]!.length;
  const q = b.length;
  const c: bigint[][] = Array.from({ length: n }, () => new Array<bigint>(p).fill(0n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < p; j++) {
      let s = 0n;
      for (let k = 0; k < q; k++) s = (s + a[i]![k]! * b[k]![j]!) % m;
      c[i]![j] = modSafe(s, m);
    }
  }
  return c;
}

function matPow(
  base: bigint[][],
  exp: number,
  m: bigint = MOD,
  hooks?: LinearRecurrenceHooks,
): bigint[][] {
  const n = base.length;
  let result: bigint[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1n : 0n)),
  );
  let b = base.map((r) => r.slice());
  let e = exp;
  let step = 0;
  while (e > 0) {
    if (e & 1) {
      result = matMul(result, b, m);
      hooks?.onMultiply?.(step);
    }
    b = matMul(b, b, m);
    e = Math.floor(e / 2);
    step++;
  }
  return result;
}

export function linearRecurrence(
  input: RecurrenceInput,
  n: number,
  hooks: LinearRecurrenceHooks = {},
): bigint {
  const { coefs, seeds } = input;
  const k = coefs.length;
  if (k === 0) return 0n;
  if (n < k) return modSafe(BigInt(seeds[n]!), MOD);

  // 伴随矩阵
  const M: bigint[][] = Array.from({ length: k }, () => new Array<bigint>(k).fill(0n));
  // 第 0 行 = coefs
  for (let j = 0; j < k; j++) M[0]![j] = BigInt(coefs[j]!);
  // 次对角线 = 1
  for (let i = 1; i < k; i++) M[i]![i - 1] = 1n;

  // state vector: [a_{n-1}, ..., a_{n-k}]^T
  const state: bigint[][] = [];
  for (let i = 0; i < k; i++) state.push([BigInt(seeds[k - 1 - i]!)]);

  const power = matPow(M, n - (k - 1), MOD, hooks);
  const result = matMul(power, state, MOD);
  return modSafe(result[0]![0]!, MOD);
}
