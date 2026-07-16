// =============================================================================
// TEA 微型加密算法 · 纯算法实现（32 轮，128 位密钥，64 位分组）
// 所有 32 位运算统一通过 u32() 规范化为无符号。
// =============================================================================
const DELTA = 0x9e3779b9;
const MASK = 0xffffffff;

/** 规范化为无符号 32 位。 */
function u32(x: number): number {
  return x >>> 0;
}
/** 模 2^32 加法。 */
function add32(a: number, b: number): number {
  return u32((a >>> 0) + (b >>> 0));
}
/** 模 2^32 减法。 */
function sub32(a: number, b: number): number {
  return u32((a >>> 0) - (b >>> 0));
}

export interface TeaHooks {
  onRound?: (round: number, v0: number, v1: number, sum: number) => void;
  onConclude?: (v0: number, v1: number) => void;
}

export interface TeaBlock {
  v0: number;
  v1: number;
}

/** 加密单个 64 位分组。 */
export function teaEncryptBlock(
  block: TeaBlock,
  key: readonly [number, number, number, number],
  rounds = 32,
  hooks: TeaHooks = {},
): TeaBlock {
  let v0 = u32(block.v0);
  let v1 = u32(block.v1);
  let sum = 0;
  const [k0, k1, k2, k3] = key;
  for (let i = 0; i < rounds; i++) {
    sum = add32(sum, DELTA);
    // v0 += ((v1<<4)+k0) ^ (v1+sum) ^ ((v1>>>5)+k1)
    const t0 = add32(add32(u32(v1 << 4), k0), add32(v1 >>> 5, k1));
    v0 = add32(v0, u32(t0 ^ add32(v1, sum)));
    const t1 = add32(add32(u32(v0 << 4), k2), add32(v0 >>> 5, k3));
    v1 = add32(v1, u32(t1 ^ add32(v0, sum)));
    hooks.onRound?.(i, v0, v1, sum);
  }
  hooks.onConclude?.(v0, v1);
  return { v0, v1 };
}

/** 解密单个 64 位分组。 */
export function teaDecryptBlock(
  block: TeaBlock,
  key: readonly [number, number, number, number],
  rounds = 32,
  hooks: TeaHooks = {},
): TeaBlock {
  let v0 = u32(block.v0);
  let v1 = u32(block.v1);
  let sum = u32((DELTA * rounds) & MASK);
  const [k0, k1, k2, k3] = key;
  for (let i = 0; i < rounds; i++) {
    const t1 = add32(add32(u32(v0 << 4), k2), add32(v0 >>> 5, k3));
    v1 = sub32(v1, u32(t1 ^ add32(v0, sum)));
    const t0 = add32(add32(u32(v1 << 4), k0), add32(v1 >>> 5, k1));
    v0 = sub32(v0, u32(t0 ^ add32(v1, sum)));
    sum = sub32(sum, DELTA);
    hooks.onRound?.(i, v0, v1, sum);
  }
  hooks.onConclude?.(v0, v1);
  return { v0, v1 };
}
