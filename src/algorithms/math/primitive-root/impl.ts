// =============================================================================
// 原根 Primitive Root · 纯算法实现
// 给定素数 p，求其最小原根 g（或所有原根）。零 DOM 依赖，可独立单测。
// 通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PrimitiveRootHooks {
  /** 分解 p-1 后得到其不同质因子列表。 */
  onFactors?: (p: number, factors: number[]) => void;
  /** 候选 g：正在验证 g 是否为原根。 */
  onCandidate?: (g: number) => void;
  /** 对候选 g 验证「g^((p-1)/qi) mod p」的某一项，给出结果与是否 ≠ 1。 */
  onCheck?: (g: number, qi: number, value: number, ok: boolean) => void;
  /** g 被否决（某项 g^((p-1)/qi) ≡ 1，或与 p 不互素）。 */
  onReject?: (g: number, reason: string) => void;
  /** 找到原根 g。 */
  onFound?: (g: number) => void;
}

/** BigInt 快速幂：base^exp mod m。 */
export function powModBig(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = ((base % m) + m) % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/** 最大公约数。 */
function gcdBig(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b > 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * 对 n 做质因数分解，返回**不同**质因子列表（升序）。`O(√n)`。
 */
export function distinctPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      factors.push(p);
      while (m % p === 0) m = Math.floor(m / p);
    }
  }
  if (m > 1) factors.push(m);
  return factors;
}

/**
 * 判定 g 是否为素数 p 的原根。
 *
 * 定理：g 是 p 的原根 ⟺ 对 p-1 的每个不同质因子 qi，都有
 *   `g^((p-1)/qi) ≢ 1 (mod p)`。
 *
 * （即 g 的阶恰好为 p-1，而不是 p-1 的真因子。）
 */
export function isPrimitiveRoot(g: number, p: number, hooks: PrimitiveRootHooks = {}): boolean {
  if (p < 2) return false;
  if (p === 2) return g % 2 === 1; // 1 是 2 的原根
  const P = BigInt(p);
  let gb = BigInt(g) % P;
  if (gb < 0n) gb += P;
  // g 必须与 p 互素（p 为素数即 g ≠ 0 mod p）
  if (gcdBig(gb, P) !== 1n) {
    hooks.onReject?.(g, `gcd(g, p) ≠ 1`);
    return false;
  }
  const factors = distinctPrimeFactors(p - 1);
  const phi = BigInt(p - 1);
  for (const qi of factors) {
    const exp = phi / BigInt(qi);
    const val = powModBig(gb, exp, P);
    const ok = val !== 1n;
    hooks.onCheck?.(g, qi, Number(val), ok);
    if (!ok) {
      hooks.onReject?.(g, `g^((p-1)/${qi}) ≡ 1 (mod p)`);
      return false;
    }
  }
  return true;
}

/**
 * 求素数 p 的**最小原根**：从 g=2 起依次验证。
 *
 * 时间：最坏 `O(p · √(p-1) · log p)`（每个候选做 φ(p-1) 项检查），但实践中
 * 最小原根通常很小（多数素数的最小原根 < 100）。
 *
 * @param p 素数（p ≥ 2）
 * @returns 最小原根 g；p=2 时返回 1；非素数抛错
 */
export function minPrimitiveRoot(p: number, hooks: PrimitiveRootHooks = {}): number {
  if (p < 2) throw new RangeError('minPrimitiveRoot: p must be ≥ 2');
  if (p === 2) {
    hooks.onFound?.(1);
    return 1;
  }
  // 简单素性检测
  if (!isPrime(p)) throw new RangeError(`minPrimitiveRoot: ${p} is not prime`);
  const factors = distinctPrimeFactors(p - 1);
  hooks.onFactors?.(p, factors);

  for (let g = 2; g < p; g++) {
    hooks.onCandidate?.(g);
    if (isPrimitiveRoot(g, p, hooks)) {
      hooks.onFound?.(g);
      return g;
    }
  }
  // 不该到这里（素数必有原根）
  throw new Error(`minPrimitiveRoot: no primitive root found for ${p}`);
}

/**
 * 求素数 p 的**所有原根**（升序）。
 *
 * 利用性质：若 g 是最小原根，则所有原根形如 `g^k`，其中 `1 ≤ k ≤ p-1` 且 `gcd(k, p-1)=1`。
 */
export function allPrimitiveRoots(p: number, hooks: PrimitiveRootHooks = {}): number[] {
  if (p < 2) throw new RangeError('allPrimitiveRoots: p must be ≥ 2');
  if (p === 2) return [1];
  const g = minPrimitiveRoot(p, hooks);
  const P = BigInt(p);
  const gb = BigInt(g);
  const roots: number[] = [];
  for (let k = 1; k <= p - 1; k++) {
    if (gcdBig(BigInt(k), BigInt(p - 1)) === 1n) {
      roots.push(Number(powModBig(gb, BigInt(k), P)));
    }
  }
  return roots.sort((a, b) => a - b);
}

/** 简单素性检测（试除到 √p），仅用于小 p。 */
export function isPrime(p: number): boolean {
  if (p < 2) return false;
  if (p % 2 === 0) return p === 2;
  for (let i = 3; i * i <= p; i += 2) {
    if (p % i === 0) return false;
  }
  return true;
}
