// MurmurHash3 x86_32 · 实现
export interface MurmurHooks {
  onBlock?: (offset: number, k: number, h: number) => void;
  onConclude?: (hash: number) => void;
}
const c1 = 0xcc9e2d51,
  c2 = 0x1b873593;
function rotl(x: number, r: number): number {
  return (x << r) | (x >>> (32 - r));
}
export function murmur3_32(data: string, seed = 0, hooks: MurmurHooks = {}): number {
  const len = data.length;
  let h = seed;
  const nblocks = Math.floor(len / 4);
  for (let i = 0; i < nblocks; i++) {
    let k =
      data.charCodeAt(i * 4) |
      (data.charCodeAt(i * 4 + 1) << 8) |
      (data.charCodeAt(i * 4 + 2) << 16) |
      (data.charCodeAt(i * 4 + 3) << 24);
    k = Math.imul(k, c1);
    k = rotl(k, 15);
    k = Math.imul(k, c2);
    h ^= k;
    h = rotl(h, 13);
    h = (Math.imul(h, 5) + 0xe6546b64) | 0;
    hooks.onBlock?.(i * 4, k >>> 0, h >>> 0);
  }
  const tail = 0,
    count = len & 3;
  if (count > 0) {
    const idx = nblocks * 4;
    let k1 = 0;
    for (let i = 0; i < count; i++) k1 ^= data.charCodeAt(idx + i) << (i * 8);
    k1 = Math.imul(k1, c1);
    k1 = rotl(k1, 15);
    k1 = Math.imul(k1, c2);
    h ^= k1;
    void tail;
  }
  h ^= len;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
