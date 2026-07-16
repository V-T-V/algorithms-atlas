// CityHash64 简化版 · 实现
const MASK64 = (1n << 64n) - 1n;
const K = 0x9ddfea08eb382d69n;
const K0 = 0xc3a5c85c97cb3127n;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}
function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--)
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
function mul64(a: bigint, b: bigint): bigint {
  return (a * b) & MASK64;
}
function fmix(h: bigint): bigint {
  h = mul64(h ^ (h >> 33n), K);
  h = mul64(h ^ (h >> 29n), K);
  h = mul64(h ^ (h >> 32n), K);
  return h;
}
function hashLen16(u: bigint, v: bigint): bigint {
  let a = mul64(u ^ v, K);
  a = (a ^ (a >> 47n)) & MASK64;
  let b = mul64(v ^ a, K);
  b = (b ^ (b >> 47n)) & MASK64;
  b = mul64(b, K);
  return b;
}

export interface CityHashHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function cityHash64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: CityHashHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const n = bytes.length;
  if (n <= 32) {
    // 简化：用 fmix + 长度 + 种子对短输入混合
    let h = mul64(BigInt(n) + 1n, K0) ^ seed;
    for (let i = 0; i < n; i++) {
      h = mul64(h ^ BigInt(bytes[i]!), K);
      h = rotl64(h, 7) ^ (h >> 3n);
      hooks.onBlock?.(i, h);
    }
    const r = fmix(h);
    hooks.onResult?.(r);
    return r;
  }
  // 长输入：分 32 字节块
  let h = mul64(BigInt(n), K0) ^ seed;
  let g = mul64(BigInt(n), K0);
  let f = h;
  const nblocks = Math.floor(n / 32);
  for (let i = 0; i < nblocks; i++) {
    const base = i * 32;
    f = mul64(f ^ readLE64(bytes, base), K) ^ g;
    g = rotl64(mul64(g ^ readLE64(bytes, base + 8), K), 23);
    h = mul64(h ^ readLE64(bytes, base + 16), K);
    h = (h ^ g) & MASK64;
    g = (g ^ f) & MASK64;
    hooks.onBlock?.(i, h);
  }
  // 处理剩余
  const rem = n - nblocks * 32;
  if (rem > 0) {
    const base = nblocks * 32;
    for (let i = 0; i < rem; i++) {
      h = mul64(h ^ BigInt(bytes[base + i]!), K);
      h = rotl64(h, 7);
    }
  }
  h = (h ^ (h >> 33n)) & MASK64;
  h = mul64(h, K);
  h = (h ^ (h >> 29n)) & MASK64;
  const r = hashLen16(h, BigInt(n));
  hooks.onResult?.(r);
  return r;
}
