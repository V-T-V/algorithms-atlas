// wyhash 简化版 · 实现
const MASK64 = (1n << 64n) - 1n;
const SECRET = [0xa0761d6478bd642fn, 0xe7037ed1a0b428dbn, 0x8ebc6af09c88c6e3n];

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--)
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
function mul64(a: bigint, b: bigint): bigint {
  return (a * b) & MASK64;
}
function mum(a: bigint, b: bigint): bigint {
  const wide = a * b;
  return ((wide & MASK64) ^ (wide >> 64n)) & MASK64;
}

export interface WyHashHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function wyHash64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: WyHashHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const n = bytes.length;
  let h = (seed ^ mul64(BigInt(n), SECRET[0]!)) & MASK64;
  const nblocks = Math.floor(n / 16);
  for (let i = 0; i < nblocks; i++) {
    const base = i * 16;
    const a = mum(readLE64(bytes, base) ^ SECRET[1]!, h);
    const b = mum(readLE64(bytes, base + 8) ^ SECRET[2]!, h);
    h = (a ^ b) & MASK64;
    hooks.onBlock?.(i, h);
  }
  // 尾部剩余
  const tailBase = nblocks * 16;
  const tailLen = n - tailBase;
  if (tailLen > 0) {
    let tail = 0n;
    for (let i = 0; i < tailLen; i++)
      tail = (tail << 8n) | BigInt(bytes[tailBase + tailLen - 1 - i]!);
    h = (h ^ mum(tail ^ SECRET[1]!, SECRET[2]!)) & MASK64;
  }
  h = mum(h ^ (h >> 33n), SECRET[0]!);
  h = mum(h ^ (h >> 29n), SECRET[1]!);
  h = mum(h ^ (h >> 33n), SECRET[2]!);
  hooks.onResult?.(h);
  return h;
}
