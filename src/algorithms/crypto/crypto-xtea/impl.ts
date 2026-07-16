// =============================================================================
// XTEA · 纯算法实现
// 参考 Wikipedia XTEA：
//   for 32 rounds:
//     v0 += (((v1<<4) ^ (v1>>>5)) + v1) ^ (sum + key[sum & 3])
//     sum += delta
//     v1 += (((v0<<4) ^ (v0>>>5)) + v0) ^ (sum + key[(sum>>>11) & 3])
// =============================================================================
const DELTA = 0x9e3779b9;
const MASK = 0xffffffff;

function u32(x: number): number {
  return x >>> 0;
}
function add32(a: number, b: number): number {
  return u32((a >>> 0) + (b >>> 0));
}
function sub32(a: number, b: number): number {
  return u32((a >>> 0) - (b >>> 0));
}

export interface XteaHooks {
  onRound?: (round: number, v0: number, v1: number, sum: number) => void;
  onConclude?: (v0: number, v1: number) => void;
}

export interface XteaBlock {
  v0: number;
  v1: number;
}

export function xteaEncryptBlock(
  block: XteaBlock,
  key: readonly [number, number, number, number],
  rounds = 32,
  hooks: XteaHooks = {},
): XteaBlock {
  let v0 = u32(block.v0);
  let v1 = u32(block.v1);
  let sum = 0;
  for (let i = 0; i < rounds; i++) {
    const m0 = add32(u32(u32(v1 << 4) ^ (v1 >>> 5)), v1);
    v0 = add32(v0, u32(m0 ^ add32(sum, key[sum & 3]!)));
    sum = add32(sum, DELTA);
    const m1 = add32(u32(u32(v0 << 4) ^ (v0 >>> 5)), v0);
    v1 = add32(v1, u32(m1 ^ add32(sum, key[(sum >>> 11) & 3]!)));
    hooks.onRound?.(i, v0, v1, sum);
  }
  hooks.onConclude?.(v0, v1);
  return { v0, v1 };
}

export function xteaDecryptBlock(
  block: XteaBlock,
  key: readonly [number, number, number, number],
  rounds = 32,
  hooks: XteaHooks = {},
): XteaBlock {
  let v0 = u32(block.v0);
  let v1 = u32(block.v1);
  let sum = u32((DELTA * rounds) & MASK);
  for (let i = 0; i < rounds; i++) {
    const m1 = add32(u32(u32(v0 << 4) ^ (v0 >>> 5)), v0);
    v1 = sub32(v1, u32(m1 ^ add32(sum, key[(sum >>> 11) & 3]!)));
    sum = sub32(sum, DELTA);
    const m0 = add32(u32(u32(v1 << 4) ^ (v1 >>> 5)), v1);
    v0 = sub32(v0, u32(m0 ^ add32(sum, key[sum & 3]!)));
    hooks.onRound?.(i, v0, v1, sum);
  }
  hooks.onConclude?.(v0, v1);
  return { v0, v1 };
}
