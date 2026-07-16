// =============================================================================
// Rabin 指纹（多项式哈希）· 纯算法实现
// H(s) = s[0]*base^(n-1) + s[1]*base^(n-2) + ... + s[n-1] (mod P)
// 支持滚动：删高位→左移→加低位。零 DOM 依赖，可独立单测。
// =============================================================================

/** 默认参数：基 256（字节自然范围），素数 2^31 - 1（Mersenne 素数）。 */
export const DEFAULT_BASE = 256;
export const DEFAULT_PRIME = 0x7fffffff; // 2^31 - 1

/** 模乘（用 BigInt 保证 a*b 在大素数下不溢出）。 */
function modMul(a: number, b: number, p: number): number {
  const A = BigInt(a);
  const B = BigInt(b);
  const P = BigInt(p);
  const r = (((A * B) % P) + P) % P;
  return Number(r);
}

/** 模加。 */
function modAdd(a: number, b: number, p: number): number {
  return (((a + b) % p) + p) % p;
}

/** 把输入归一化为字节数组。 */
function toBytes(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(new TextEncoder().encode(data));
  }
  return data;
}

/** 事件钩子。 */
export interface RabinHooks {
  /** 初始化首窗口指纹完成。 */
  onInit?: (windowStart: number, hash: number) => void;
  /** 滚动一步：从 [i, i+window) 滚到 [i+1, i+1+window)。 */
  onRoll?: (i: number, outByte: number, inByte: number, hash: number) => void;
  /** 命中（指纹相等）。 */
  onMatch?: (windowStart: number) => void;
}

/**
 * 用快速幂计算 base^exp mod p。
 */
export function modPow(base: number, exp: number, p: number): number {
  let result = 1;
  let b = ((base % p) + p) % p;
  let e = exp;
  while (e > 0) {
    if (e & 1) result = modMul(result, b, p);
    b = modMul(b, b, p);
    e = Math.floor(e / 2);
  }
  return result;
}

/**
 * 计算单个窗口的 Rabin 指纹（不带滚动）。
 */
export function rabinFingerprint(
  data: string | number[],
  base: number = DEFAULT_BASE,
  prime: number = DEFAULT_PRIME,
): number {
  const bytes = toBytes(data);
  let h = 0;
  for (let i = 0; i < bytes.length; i++) {
    h = modAdd(modMul(h, base, prime), bytes[i]! & 0xff, prime);
  }
  return h;
}

/**
 * 在文本中用 Rabin-Karp 滚动哈希搜索模式。
 * @param text 文本（字符串或字节数组）
 * @param pattern 模式
 * @param base 基数
 * @param prime 素数模
 * @param hooks 可选事件钩子
 * @returns 模式在文本中所有出现的起始下标
 */
export function rabinKarpSearch(
  text: string | number[],
  pattern: string | number[],
  base: number = DEFAULT_BASE,
  prime: number = DEFAULT_PRIME,
  hooks: RabinHooks = {},
): number[] {
  const t = toBytes(text);
  const pat = toBytes(pattern);
  const n = t.length;
  const m = pat.length;
  const matches: number[] = [];
  if (m === 0 || m > n) return matches;

  // base^(m-1) mod p（用于滚动时减去最高位）
  const highPow = modPow(base, m - 1, prime);

  // 模式指纹
  let patHash = 0;
  for (let i = 0; i < m; i++) {
    patHash = modAdd(modMul(patHash, base, prime), pat[i]! & 0xff, prime);
  }

  // 首窗口指纹
  let winHash = 0;
  for (let i = 0; i < m; i++) {
    winHash = modAdd(modMul(winHash, base, prime), t[i]! & 0xff, prime);
  }
  hooks.onInit?.(0, winHash);

  if (winHash === patHash && bytesEqual(t, 0, pat)) {
    matches.push(0);
    hooks.onMatch?.(0);
  }

  // 滚动
  for (let i = 0; i < n - m; i++) {
    const outByte = t[i]! & 0xff;
    const inByte = t[i + m]! & 0xff;
    // 减去最高位贡献：winHash - outByte * base^(m-1)
    winHash = (winHash - modMul(outByte, highPow, prime) + prime) % prime;
    // 左移一位
    winHash = modMul(winHash, base, prime);
    // 加入新最低位
    winHash = modAdd(winHash, inByte, prime);
    hooks.onRoll?.(i, outByte, inByte, winHash);

    if (winHash === patHash && bytesEqual(t, i + 1, pat)) {
      matches.push(i + 1);
      hooks.onMatch?.(i + 1);
    }
  }

  return matches;
}

/** 逐字节比较 text[off..off+pat.length) 与 pat。 */
function bytesEqual(text: number[], off: number, pat: number[]): boolean {
  for (let i = 0; i < pat.length; i++) {
    if (text[off + i] !== pat[i]) return false;
  }
  return true;
}
