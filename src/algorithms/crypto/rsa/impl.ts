// =============================================================================
// RSA（玩具版，小素数）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露密钥生成 / 加密 / 解密每一步，供录制器使用。
// 用 BigInt 做模幂，保证正确性（即便玩具版也严格遵循数论）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RsaHooks {
  /** 选定两个素数 p, q。 */
  onPrimes?: (p: number, q: number) => void;
  /** 计算出模数 n 与欧拉函数 phi。 */
  onModulus?: (n: number, phi: number) => void;
  /** 选定公钥指数 e。 */
  onPublicExponent?: (e: number) => void;
  /** 求出私钥指数 d（满足 e·d ≡ 1 mod phi）。 */
  onPrivateExponent?: (d: number) => void;
  /** 加密第 i 个明文（明文 m、密文 c）。 */
  onEncrypt?: (i: number, m: number, c: number) => void;
  /** 解密第 i 个密文（密文 c、明文 m）。 */
  onDecrypt?: (i: number, c: number, m: number) => void;
}

export interface RsaKey {
  p: number;
  q: number;
  n: number; // 模数 = p·q
  phi: number; // 欧拉函数 = (p-1)(q-1)
  e: number; // 公钥指数
  d: number; // 私钥指数
}

export interface RsaResult {
  key: RsaKey;
  /** 与输入等长的密文数组。 */
  cipher: number[];
  /** 解密后的明文数组（应与原文一致）。 */
  plain: number[];
}

/** 最大公约数（用于验证 e 与 phi 互素）。 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * 模幂（快速幂）：base^exp mod m。用 BigInt 保证大数正确，结果回 Number。
 * 玩具版数值小，Number 足够；BigInt 仅为严格正确。
 */
export function modPow(base: number, exp: number, m: number): number {
  let result = 1n;
  let b = BigInt(base) % BigInt(m);
  let e = BigInt(exp);
  const mod = BigInt(m);
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }
  return Number(result);
}

/**
 * 扩展欧几里得算法：求 a 在模 m 下的乘法逆元 x（a·x ≡ 1 mod m）。
 * 要求 gcd(a, m) = 1，否则返回 -1。
 */
export function modInverse(a: number, m: number): number {
  // 用 BigInt 做扩展欧几里得
  let oldR = BigInt(a),
    r = BigInt(m);
  let oldS = 1n,
    s = 0n;
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if (oldR !== 1n && oldR !== -1n) return -1; // 不互素
  const inv = Number(((oldS % BigInt(m)) + BigInt(m)) % BigInt(m));
  return inv;
}

/** 在 [min,max] 区间内选出第一个与 phi 互素且 > 1 的整数作公钥指数。 */
export function chooseE(phi: number, min = 2): number {
  for (let e = Math.max(2, min); e < phi; e++) {
    if (gcd(e, phi) === 1) return e;
  }
  return -1;
}

/**
 * 生成 RSA 密钥（玩具版：直接给定两个小素数 p, q）。
 *
 * @param p 素数
 * @param q 素数（≠ p）
 * @param hooks 可选事件钩子
 */
export function rsaKeygen(p: number, q: number, hooks: RsaHooks = {}): RsaKey {
  hooks.onPrimes?.(p, q);
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  hooks.onModulus?.(n, phi);
  const e = chooseE(phi);
  hooks.onPublicExponent?.(e);
  const d = modInverse(e, phi);
  hooks.onPrivateExponent?.(d);
  return { p, q, n, phi, e, d };
}

/**
 * 用公钥 (e, n) 加密单个明文整数 m（必须满足 0 ≤ m < n）。
 */
export function rsaEncryptChar(m: number, e: number, n: number): number {
  return modPow(m, e, n);
}

/**
 * 用私钥 (d, n) 解密单个密文 c。
 */
export function rsaDecryptChar(c: number, d: number, n: number): number {
  return modPow(c, d, n);
}

/**
 * RSA 玩具版完整流程：密钥生成 → 加密 → 解密。
 *
 * @param p,q 两个不同的小素数
 * @param message 明文整数数组（每个元素须 0 ≤ m < p·q）
 * @param hooks 可选事件钩子
 */
export function rsa(message: number[], p: number, q: number, hooks: RsaHooks = {}): RsaResult {
  const key = rsaKeygen(p, q, hooks);
  const cipher = message.map((m, i) => {
    const c = rsaEncryptChar(m, key.e, key.n);
    hooks.onEncrypt?.(i, m, c);
    return c;
  });
  const plain = cipher.map((c, i) => {
    const m = rsaDecryptChar(c, key.d, key.n);
    hooks.onDecrypt?.(i, c, m);
    return m;
  });
  return { key, cipher, plain };
}
