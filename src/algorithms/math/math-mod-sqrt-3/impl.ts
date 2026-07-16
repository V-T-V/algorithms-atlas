// =============================================================================
// 模平方根 Tonelli-Shanks
// =============================================================================

export interface ModSqrtHooks {
  onResidue?: (isResidue: boolean) => void;
  onIter?: (round: number, x: bigint) => void;
  onDone?: (root: bigint | null) => void;
}

function pow(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = base % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

export function modSqrt(
  n: number | bigint,
  p: number | bigint,
  hooks: ModSqrtHooks = {},
): bigint | null {
  const N = typeof n === 'bigint' ? n : BigInt(n);
  const P = typeof p === 'bigint' ? p : BigInt(p);
  const a = ((N % P) + P) % P;
  if (a === 0n) {
    hooks.onDone?.(0n);
    return 0n;
  }
  if (P === 2n) {
    hooks.onDone?.(a);
    return a;
  }
  // 欧拉判据
  const legendre = pow(a, (P - 1n) / 2n, P);
  if (legendre !== 1n) {
    hooks.onResidue?.(false);
    hooks.onDone?.(null);
    return null;
  }
  hooks.onResidue?.(true);
  // p ≡ 3 mod 4 快速公式
  if (P % 4n === 3n) {
    const r = pow(a, (P + 1n) / 4n, P);
    hooks.onDone?.(r);
    return r;
  }
  // 分解 p-1 = Q·2^S
  let Q = P - 1n;
  let S = 0n;
  while (Q % 2n === 0n) {
    Q /= 2n;
    S++;
  }
  // 找二次非剩余 z
  let z = 2n;
  while (pow(z, (P - 1n) / 2n, P) !== P - 1n) z++;
  let M = S;
  let c = pow(z, Q, P);
  let t = pow(a, Q, P);
  let R = pow(a, (Q + 1n) / 2n, P);
  let round = 0;
  while (t !== 1n) {
    let i = 0n;
    let tmp = t;
    while (tmp !== 1n) {
      tmp = (tmp * tmp) % P;
      i++;
      if (i === M) {
        hooks.onDone?.(null);
        return null;
      }
    }
    const b = pow(c, 1n << (M - i - 1n), P);
    M = i;
    c = (b * b) % P;
    t = (t * c) % P;
    R = (R * b) % P;
    round++;
    hooks.onIter?.(round, R);
  }
  hooks.onDone?.(R);
  return R;
}
