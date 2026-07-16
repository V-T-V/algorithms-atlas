// =============================================================================
// 扩展卢卡斯 ExLucas · 纯算法实现
// 计算 C(n, m) mod M，其中 M 为任意正整数（不必为素数）。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/**
 * 事件钩子。任一可选。
 */
export interface ExLucasHooks {
  /** 把模数 M 分解出一个素数幂因子 p^q。 */
  onFactor?: (p: bigint, q: bigint, modulus: bigint) => void;
  /** 在某个素数幂 p^q 下求得的部分结果 r。 */
  onSubResult?: (p: bigint, q: bigint, r: bigint) => void;
  /** CRT 合并步骤：当前累乘结果。 */
  onCrt?: (accumulated: bigint, totalModulus: bigint) => void;
  /** 最终结果。 */
  onDone?: (n: bigint, m: bigint, modulus: bigint, result: bigint) => void;
}

/** 扩展欧几里得：返回 {g, x, y}，使 a*x + b*y = g = gcd(a,b)。 */
function extGcd(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const r = extGcd(b, a % b);
  return { g: r.g, x: r.y, y: r.x - (a / b) * r.y };
}

/** a mod m，结果落在 [0, m)。 */
function mod(a: bigint, m: bigint): bigint {
  return ((a % m) + m) % m;
}

/** a^{-1} mod m（要求 gcd(a,m)=1）。 */
function modInverse(a: bigint, m: bigint): bigint {
  const { g, x } = extGcd(mod(a, m), m);
  if (g !== 1n) throw new Error('模逆不存在');
  return mod(x, m);
}

/**
 * 计算 n! 中去掉所有 p 的因子后的「剩余乘积」 mod p^q。
 * 即 Wilson 定理推广：(n!)_p mod p^q。
 *
 * 设 f(n) = (n!)_p mod p^q，满足递推：
 *   f(n) ≡ f(n/p) · (∏_{1≤i≤p^q, p∤i} i)^{⌊n/p^q⌋} · (∏_{1≤i≤n mod p^q, p∤i} i)  (mod p^q)
 * 递归一次后 n 缩小为 n/p（log 次）。
 */
function factWithoutP(n: bigint, p: bigint, q: bigint, pk: bigint): bigint {
  if (n === 0n) return 1n;
  // 一个完整循环节的乘积：∏_{1≤i≤pk, p∤i} i  mod pk
  let cycle = 1n;
  for (let i = 1n; i <= pk; i++) {
    if (i % p !== 0n) cycle = (cycle * i) % pk;
  }
  let result = 1n;
  // cycle^{⌊n/pk⌋}
  const fullCycles = n / pk;
  for (let k = 0n; k < fullCycles; k++) result = (result * cycle) % pk;
  // 不足一节的尾巴
  const tail = n % pk;
  for (let i = 1n; i <= tail; i++) {
    if (i % p !== 0n) result = (result * i) % pk;
  }
  // 递归：f(n/p)
  result = (result * factWithoutP(n / p, p, q, pk)) % pk;
  return result;
}

/**
 * Legendre 公式：n! 中素因子 p 的指数。
 */
function countP(n: bigint, p: bigint): bigint {
  let e = 0n;
  let pk = p;
  while (pk <= n) {
    e += n / pk;
    pk *= p;
  }
  return e;
}

/**
 * 计算 C(n, m) mod p^q。
 * C(n,m) = (n!)_p / ((m!)_p · (n−m)!)_p) · p^{e}, 其中 e 为 p 的指数差。
 */
function combModPrimePower(n: bigint, m: bigint, p: bigint, q: bigint, pk: bigint): bigint {
  if (m < 0n || m > n) return 0n;
  const e = countP(n, p) - countP(m, p) - countP(n - m, p);
  if (e >= q) return 0n; // p^q 整除该组合数
  const fn = factWithoutP(n, p, q, pk);
  const fm = factWithoutP(m, p, q, pk);
  const fnm = factWithoutP(n - m, p, q, pk);
  const denom = mod(fm * fnm, pk);
  const base = mod(fn * modInverse(denom, pk), pk);
  let pe = 1n;
  for (let i = 0n; i < e; i++) pe *= p;
  return mod(base * pe, pk);
}

/**
 * 扩展卢卡斯：计算 C(n, m) mod M，M 为任意正整数。
 *
 * 流程：
 *   1. 分解 M = ∏ p_i^{q_i}。
 *   2. 对每个 p_i^{q_i} 用 Wilson 推广求 C(n,m) mod p_i^{q_i}。
 *   3. CRT 合并各分量。
 *
 * @param n 上数
 * @param m 下数
 * @param modulus 模数 M（正整数，可合数）
 */
export function exLucas(n: bigint, m: bigint, modulus: bigint, hooks: ExLucasHooks = {}): bigint {
  if (modulus <= 0n) throw new RangeError('modulus 需为正整数');

  // 1. 分解模数
  const factors: Array<{ p: bigint; q: bigint; pk: bigint }> = [];
  let mm = modulus;
  for (let p = 2n; p * p <= mm; p++) {
    if (mm % p === 0n) {
      let q = 0n;
      let pk = 1n;
      while (mm % p === 0n) {
        mm /= p;
        q++;
        pk *= p;
      }
      factors.push({ p, q, pk });
      hooks.onFactor?.(p, q, pk);
    }
  }
  if (mm > 1n) {
    factors.push({ p: mm, q: 1n, pk: mm });
    hooks.onFactor?.(mm, 1n, mm);
  }

  // 2. 每个分量
  let result = 0n;
  const M = modulus;
  for (const { p, q, pk } of factors) {
    const r = combModPrimePower(n, m, p, q, pk);
    hooks.onSubResult?.(p, q, r);
    // CRT 合并：x ≡ result (mod M/pk)，x ≡ r (mod pk)
    const Mi = M / pk;
    const ti = modInverse(Mi, pk);
    result = mod(result + mod(r * Mi, M) * ti, M);
    hooks.onCrt?.(result, M);
  }
  hooks.onDone?.(n, m, modulus, result);
  return result;
}
