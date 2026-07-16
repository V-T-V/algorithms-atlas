// =============================================================================
// 矩阵快速幂 Matrix Fast Exponentiation · 纯算法实现
// 计算 k×k 方阵 A 的 n 次幂（n >= 0），可选取模。
// 内部全程使用 BigInt 运算，避免大指数时 number 精度溢出。
// =============================================================================

export type Matrix = number[][];

/** 校验是否为 k×k 方阵，返回维数 k。 */
function dim(a: Matrix): number {
  const k = a.length;
  for (const row of a) {
    if (row.length !== k) throw new TypeError('matrixPower: matrix must be square');
  }
  return k;
}

/** k×k 单位矩阵。 */
export function identity(k: number): Matrix {
  const m: Matrix = [];
  for (let i = 0; i < k; i++) {
    const row = new Array<number>(k).fill(0);
    row[i] = 1;
    m.push(row);
  }
  return m;
}

type BigMat = bigint[][];

function toBig(a: Matrix, mod?: number): BigMat {
  if (mod !== undefined) {
    const m = BigInt(mod);
    return a.map((row) => row.map((v) => ((BigInt(v) % m) + m) % m));
  }
  return a.map((row) => row.map((v) => BigInt(v)));
}

function fromBig(a: BigMat): Matrix {
  return a.map((row) => row.map((v) => Number(v)));
}

function bigIdentity(k: number, mod?: number): BigMat {
  const one = mod !== undefined ? 1n % BigInt(mod) : 1n;
  const m: BigMat = [];
  for (let i = 0; i < k; i++) {
    const row = new Array<bigint>(k).fill(0n);
    row[i] = one;
    m.push(row);
  }
  return m;
}

/** 两个 k×k 矩阵相乘，可选取模（BigInt 运算）。 */
export function matMul(a: Matrix, b: Matrix, mod?: number): Matrix {
  const k = dim(a);
  const kb = dim(b);
  if (k !== kb) throw new TypeError('matMul: dimension mismatch');
  const aa = toBig(a, mod);
  const bb = toBig(b, mod);
  const out: BigMat = [];
  const m = mod !== undefined ? BigInt(mod) : undefined;
  for (let i = 0; i < k; i++) {
    const row = new Array<bigint>(k).fill(0n);
    for (let l = 0; l < k; l++) {
      const ail = aa[i]![l]!;
      if (ail === 0n) continue;
      for (let j = 0; j < k; j++) {
        row[j]! += ail * bb[l]![j]!;
      }
    }
    if (m !== undefined) {
      for (let j = 0; j < k; j++) row[j] = ((row[j]! % m) + m) % m;
    }
    out.push(row);
  }
  return fromBig(out);
}

/** 事件钩子。 */
export interface MatrixPowerHooks {
  /** 观察指数某一位 bit，base 为当前平方累积矩阵。 */
  onBit?: (bit: 0 | 1, base: Matrix, exp: number) => void;
  /** base 自乘平方一次。 */
  onSquare?: (base: Matrix) => void;
  /** 当前位为 1，result = result · base。 */
  onMultiply?: (result: Matrix, base: Matrix) => void;
}

/** BigInt 矩阵乘法（内部）。 */
function mulBig(a: BigMat, b: BigMat, m: bigint | undefined, k: number): BigMat {
  const out: BigMat = [];
  for (let i = 0; i < k; i++) {
    const row = new Array<bigint>(k).fill(0n);
    for (let l = 0; l < k; l++) {
      const ail = a[i]![l]!;
      if (ail === 0n) continue;
      for (let j = 0; j < k; j++) row[j]! += ail * b[l]![j]!;
    }
    if (m !== undefined) {
      for (let j = 0; j < k; j++) row[j] = ((row[j]! % m) + m) % m;
    }
    out.push(row);
  }
  return out;
}

/**
 * 矩阵快速幂：计算 `A^n`（A 为 k×k 方阵）。
 * @param A 方阵
 * @param n 非负整数指数（n=0 返回单位矩阵）
 * @param mod 可选模数
 * @returns A^n
 */
export function matrixPower(
  A: Matrix,
  n: number,
  mod?: number,
  hooks: MatrixPowerHooks = {},
): Matrix {
  if (n < 0) throw new RangeError('matrixPower: n must be non-negative');
  const k = dim(A);
  const m = mod !== undefined ? BigInt(mod) : undefined;
  let result = bigIdentity(k, mod);
  let base = toBig(A, mod);
  let e = n;

  while (e > 0) {
    const bit = (e & 1) as 0 | 1;
    hooks.onBit?.(bit, fromBig(base), e);
    if (bit === 1) {
      result = mulBig(result, base, m, k);
      hooks.onMultiply?.(fromBig(result), fromBig(base));
    }
    e = Math.floor(e / 2);
    if (e > 0) {
      base = mulBig(base, base, m, k);
      hooks.onSquare?.(fromBig(base));
    }
  }
  return fromBig(result);
}
