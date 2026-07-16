// =============================================================================
// 小步大步算法（Baby-Step Giant-Step, BSGS）· 纯算法实现
// 求离散对数：给定 a, b, p（p 为素数，gcd(a,p)=1），求最小非负 x 使 a^x ≡ b (mod p)。
// 设 m=⌈√p⌉。预计算「小步」baby[j]=a^j mod p（j=0..m-1）入哈希；
// 对 i=0..m，检查 b·(a^{-m})^i 是否等于某个 baby[j]，则 x=i·m+j。
// 与 discrete-log（通用）区分：本实现是经典 BSGS。
// 复杂度 O(√p)。
// =============================================================================

export interface BsgsHooks {
  onBabyStep?: (j: number, val: number) => void;
  onGiantStep?: (i: number, val: number, hit: boolean) => void;
  onResult?: (x: number | null) => void;
}

const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let r = 1n;
  let b = base % mod;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % mod;
    b = (b * b) % mod;
    e >>= 1n;
  }
  return r;
};

const invMod = (a: bigint, mod: bigint): bigint => modPow(a, mod - 2n, mod); // 要求 mod 为素数

export function babyStepGiantStep(
  a: number,
  b: number,
  p: number,
  hooks: BsgsHooks = {},
): number | null {
  if (p <= 1) {
    hooks.onResult?.(null);
    return null;
  }
  const A = BigInt(a) % BigInt(p);
  const B = BigInt(b) % BigInt(p);
  const P = BigInt(p);
  if (B === 1n) {
    hooks.onResult?.(0);
    return 0; // a^0 = 1
  }
  const m = BigInt(Math.ceil(Math.sqrt(p)));
  // 小步：baby[j] = A^j
  const baby = new Map<bigint, bigint>();
  let cur = 1n;
  for (let j = 0n; j < m; j++) {
    if (!baby.has(cur)) baby.set(cur, j); // 保留最小 j
    hooks.onBabyStep?.(Number(j), Number(cur));
    cur = (cur * A) % P;
  }
  // 因子：A^{-m}
  const factor = invMod(modPow(A, m, P), P);
  let gamma = B;
  for (let i = 0n; i <= m; i++) {
    const hit = baby.has(gamma);
    hooks.onGiantStep?.(Number(i), Number(gamma), hit);
    if (hit) {
      const j = baby.get(gamma)!;
      const x = i * m + j;
      hooks.onResult?.(Number(x));
      return Number(x);
    }
    gamma = (gamma * factor) % P;
  }
  hooks.onResult?.(null);
  return null;
}

export const _modPow = modPow;
