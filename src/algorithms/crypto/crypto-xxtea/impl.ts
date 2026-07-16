// =============================================================================
// XXTEA · 纯算法实现（Wikipedia C 版本的直接移植）
// 加密一个 32 位无符号整型数组（长度 n>=2），密钥为 4 个 32 位整型。
// =============================================================================
const DELTA = 0x9e3779b9;
const MASK = 0xffffffff;

function u32(x: number): number {
  return x >>> 0;
}
function add32(a: number, b: number): number {
  return u32((a >>> 0) + (b >>> 0));
}
function mx(z: number, y: number, sum: number, p: number, e: number, k: readonly number[]): number {
  // MX = (((z>>5 ^ y<<2) + (y>>3 ^ z<<4)) ^ ((sum^y) + (k[(p&3)^e] ^ z)))
  const a = add32(u32((z >>> 5) ^ (y << 2)), u32((y >>> 3) ^ (z << 4)));
  const b = add32(u32(sum ^ y), u32(k[u32((p & 3) ^ e)]! ^ z));
  return u32(a ^ b);
}

export interface XxteaHooks {
  onRound?: (round: number, v: number[]) => void;
  onConclude?: (v: number[]) => void;
}

/** 加密整个字数组。原地修改并返回。 */
export function xxteaEncrypt(
  v: number[],
  key: readonly [number, number, number, number],
  hooks: XxteaHooks = {},
): number[] {
  const n = v.length;
  if (n < 2) return v;
  const k = key;
  let q = 6 + Math.floor(52 / n);
  let sum = 0;
  let z = v[n - 1]!;
  let y = v[0]!;
  while (q-- > 0) {
    sum = add32(sum, DELTA);
    const e = u32(sum >>> 2) & 3;
    for (let p = 0; p < n - 1; p++) {
      y = v[p + 1]!;
      v[p] = add32(v[p]!, mx(z, y, sum, p, e, k));
      z = v[p]!;
    }
    y = v[0]!;
    v[n - 1] = add32(v[n - 1]!, mx(z, y, sum, n - 1, e, k));
    z = v[n - 1]!;
    hooks.onRound?.(6 + Math.floor(52 / n) - q - 1, [...v]);
  }
  hooks.onConclude?.(v);
  return v;
}

/** 解密整个字数组。原地修改并返回。 */
export function xxteaDecrypt(
  v: number[],
  key: readonly [number, number, number, number],
  hooks: XxteaHooks = {},
): number[] {
  const n = v.length;
  if (n < 2) return v;
  const k = key;
  const q = 6 + Math.floor(52 / n);
  let sum = u32((q * DELTA) & MASK);
  let y = v[0]!;
  let z: number;
  do {
    const e = u32(sum >>> 2) & 3;
    for (let p = n - 1; p > 0; p--) {
      z = v[p - 1]!;
      v[p] = u32(v[p]! - mx(z, y, sum, p, e, k));
      y = v[p]!;
    }
    z = v[n - 1]!;
    v[0] = u32(v[0]! - mx(z, y, sum, 0, e, k));
    y = v[0]!;
    sum = u32(sum - DELTA);
    hooks.onRound?.(0, [...v]);
  } while (sum !== 0);
  hooks.onConclude?.(v);
  return v;
}
