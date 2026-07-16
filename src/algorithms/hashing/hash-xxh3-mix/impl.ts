// XXH3-style mix · 实现 (简化)
export interface XxhHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onConclude?: (hash: number) => void;
}
const PRIME64_1 = 0x9e3779b185ebca87n;
const PRIME64_2 = 0xc2b2ae3d27d4eb4fn;
const MASK = (1n << 64n) - 1n;
export function xxh3Mix(data: string, seed = 0n, hooks: XxhHooks = {}): number {
  let acc = (seed ^ PRIME64_1) & MASK;
  for (let i = 0; i < data.length; i += 8) {
    let lane = 0n;
    for (let j = 0; j < 8 && i + j < data.length; j++)
      lane |= BigInt(data.charCodeAt(i + j)!) << (8n * BigInt(j));
    acc = (acc + BigInt(Math.imul(Number(lane & 0xffffffffn), 0x9e3779b1) >>> 0)) & MASK;
    acc = ((acc ^ rotl64(lane, 31n)) * PRIME64_2) & MASK;
    hooks.onBlock?.(i / 8, acc);
  }
  acc = (acc + BigInt(data.length)) & MASK;
  acc ^= acc >> 33n;
  acc = (acc * PRIME64_2) & MASK;
  acc ^= acc >> 29n;
  acc = (acc * PRIME64_1) & MASK;
  acc ^= acc >> 32n;
  const out = Number(acc & 0xffffffffn) >>> 0;
  hooks.onConclude?.(out);
  return out;
}
function rotl64(x: bigint, r: bigint): bigint {
  return ((x << r) | (x >> (64n - r))) & MASK;
}
