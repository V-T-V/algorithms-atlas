// FarmHash64 简化版 · 实现
const MASK64 = (1n << 64n) - 1n;
const K = 0x9ddfea08eb382d69n;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}
function mul64(a: bigint, b: bigint): bigint {
  return (a * b) & MASK64;
}

export interface FarmHashHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function farmHash64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: FarmHashHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const n = bytes.length;
  let h = mul64(BigInt(n), K) ^ seed;
  for (let i = 0; i < n; i++) {
    h = mul64(h ^ BigInt(bytes[i]!), K);
    h = rotl64(h, 13) ^ (h >> 7n);
    hooks.onBlock?.(i, h);
  }
  h = mul64(h ^ (h >> 33n), K);
  h = mul64(h ^ (h >> 29n), K);
  h = mul64(h ^ (h >> 32n), K);
  hooks.onResult?.(h);
  return h;
}
