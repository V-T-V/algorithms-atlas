// hash-ripemd-impl 简化 · 实现（4 个 64 位字输出，单块链式）
const MASK64 = (1n << 64n) - 1n;
const IV: bigint[] = [0x67452301n, 0xefcdab89n, 0x98badcfen, 0x10325476n];
const MIX = 0x5c4dd124n;
const SHIFT = 11n;
function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--)
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
export interface RipemdImplHooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: bigint[]) => void;
}
export function hashRipemdImpl(
  data: string | readonly number[],
  hooks: RipemdImplHooks = {},
): bigint[] {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const state = [...IV];
  const CHUNK = 32;
  const nchunks = Math.max(1, Math.ceil(bytes.length / CHUNK));
  for (let c = 0; c < nchunks; c++) {
    const base = c * CHUNK;
    const words: bigint[] = [];
    for (let w = 0; w < 4; w++) words.push(readLE64(bytes, base + w * 8));
    for (let i = 0; i < 4; i++) {
      state[i] = (state[i]! + words[i]!) & MASK64;
      state[i] = ((state[i]! << SHIFT) | (state[i]! >> (64n - SHIFT))) & MASK64;
      state[i] = (state[i]! ^ MIX) & MASK64;
    }
    hooks.onBlock?.(c);
  }
  hooks.onResult?.(state);
  return state;
}
