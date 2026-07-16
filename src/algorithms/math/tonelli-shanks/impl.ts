// =============================================================================
// Tonelli-Shanks 模平方根 · 纯算法实现
// 求奇素数 p 下 x² ≡ n (mod p)。BigInt 实现。
// =============================================================================

/** 事件钩子。 */
export interface TonelliShanksHooks {
  /** 分解 p-1 = q · 2^k。 */
  onDecompose?: (q: bigint, k: number) => void;
  /** 找到二次非剩余 z。 */
  onNonResidue?: (z: bigint) => void;
  /** 一次迭代：当前 M、找到的 i、新 r。 */
  onIter?: (M: number, i: number, r: bigint) => void;
  /** 最终结果 r 或 null（无解）。 */
  onResult?: (r: bigint | null) => void;
}

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let b = ((base % m) + m) % m;
  let e = exp;
  let r = 1n % m;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

/**
 * Tonelli-Shanks：求 x 使 x² ≡ n (mod p)，p 为奇素数。
 * @returns r (0 ≤ r < p)，若 n 为非剩余返回 null
 */
export function tonelliShanks(
  n: number | bigint,
  p: number | bigint,
  hooks: TonelliShanksHooks = {},
): bigint | null {
  const nn = (((typeof n === 'number' ? BigInt(n) : n) % BigInt(p)) + BigInt(p)) % BigInt(p);
  const pp = typeof p === 'number' ? BigInt(p) : p;

  if (nn === 0n) {
    hooks.onResult?.(0n);
    return 0n;
  }
  // 欧拉判别
  if (powMod(nn, (pp - 1n) / 2n, pp) !== 1n) {
    hooks.onResult?.(null);
    return null;
  }
  // p ≡ 3 mod 4 特例
  if (pp % 4n === 3n) {
    const r = powMod(nn, (pp + 1n) / 4n, pp);
    hooks.onResult?.(r);
    return r;
  }

  // 分解 p-1 = q · 2^k
  let q = pp - 1n;
  let k = 0;
  while ((q & 1n) === 0n) {
    q >>= 1n;
    k++;
  }
  hooks.onDecompose?.(q, k);

  // 找二次非剩余 z
  let z = 2n;
  while (powMod(z, (pp - 1n) / 2n, pp) !== pp - 1n) z++;
  hooks.onNonResidue?.(z);

  let M = k;
  let c = powMod(z, q, pp);
  let t = powMod(nn, q, pp);
  let r = powMod(nn, (q + 1n) / 2n, pp);

  while (t !== 1n) {
    // 找最小 i, 0 < i < M, 使 t^(2^i) = 1
    let i = 0;
    let temp = t;
    while (temp !== 1n) {
      temp = (temp * temp) % pp;
      i++;
      if (i === M) break;
    }
    // b = c^(2^(M-i-1))
    let b = c;
    for (let j = 0; j < M - i - 1; j++) b = (b * b) % pp;
    M = i;
    c = (b * b) % pp;
    t = (t * c) % pp;
    r = (r * b) % pp;
    hooks.onIter?.(M, i, r);
  }
  hooks.onResult?.(r);
  return r;
}
