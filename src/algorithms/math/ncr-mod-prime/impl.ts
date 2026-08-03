// =============================================================================
// 组合数模素数 · 纯算法实现
// 预处理 fact / invfact，O(1) 查询；含 Lucas 包装。
// =============================================================================

export interface NCrModPrimeContext {
  p: bigint;
  fact: bigint[];
  invfact: bigint[];
}

/** 事件钩子。 */
export interface NCrModPrimeHooks {
  /** 完成阶乘预处理。 */
  onPrecompute?: (N: number, p: bigint) => void;
  /** 一次组合查询 C(n,r) = v。 */
  onQuery?: (n: number, r: number, v: bigint) => void;
  /** Lucas 分解：把 C(n,r) 拆为 ∏ C(n_i, r_i)。 */
  onLucas?: (digits: Array<{ ni: number; ri: number }>) => void;
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

/** 预处理 [0, N] 的阶乘与逆阶乘 mod p。 */
export function precomputeFactorials(N: number, p: number | bigint): NCrModPrimeContext {
  const pp = typeof p === 'number' ? BigInt(p) : p;
  const fact = new Array<bigint>(N + 1).fill(1n);
  const invfact = new Array<bigint>(N + 1).fill(1n);
  for (let i = 2; i <= N; i++) fact[i] = (fact[i - 1]! * BigInt(i)) % pp;
  invfact[N] = powMod(fact[N]!, pp - 2n, pp);
  for (let i = N - 1; i >= 0; i--) invfact[i] = (invfact[i + 1]! * BigInt(i + 1)) % pp;
  return { p: pp, fact, invfact };
}

/** 单次 C(n, r) mod p，要求 n < p 且 ctx 已覆盖到 n。 */
export function nCrSmall(
  ctx: NCrModPrimeContext,
  n: number,
  r: number,
  hooks: NCrModPrimeHooks = {},
): bigint {
  if (r < 0 || r > n) return 0n;
  const v = (((ctx.fact[n]! * ctx.invfact[r]!) % ctx.p) * ctx.invfact[n - r]!) % ctx.p;
  hooks.onQuery?.(n, r, v);
  return v;
}

/**
 * Lucas 定理：C(n, r) mod p（p 素数），n 可大于 p。
 * 反复 C(n,r) = C(n mod p, r mod p) · C(n/p, r/p) mod p。
 */
export function nCrLucas(
  ctx: NCrModPrimeContext,
  n: number,
  r: number,
  hooks: NCrModPrimeHooks = {},
): bigint {
  let nn = n;
  let rr = r;
  let result = 1n;
  const digits: Array<{ ni: number; ri: number }> = [];
  const pp = ctx.p;
  const ppNum = Number(pp);
  while (nn > 0 || rr > 0) {
    const ni = Number(BigInt(nn) % pp);
    const ri = Number(BigInt(rr) % pp);
    digits.push({ ni, ri });
    result = (result * nCrSmall(ctx, ni, ri)) % pp;
    nn = Math.floor(nn / ppNum);
    rr = Math.floor(rr / ppNum);
  }
  hooks.onLucas?.(digits);
  return result;
}
