// =============================================================================
// MurmurHash3 128 位 · 纯算法实现
// 用 BigInt 表达 64 位运算。
// =============================================================================

const MASK64 = (1n << 64n) - 1n;
const C1 = 0x87c37b91114253d5n;
const C2 = 0x4cf5ad432745937fn;

export interface Murmur128Hooks {
  onBlock?: (blockIndex: number, h1: bigint, h2: bigint) => void;
  onResult?: (h1: bigint, h2: bigint) => void;
}

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}

function fmix64(k: bigint): bigint {
  let x = k;
  x ^= x >> 33n;
  x = (x * 0xff51afd7ed558ccdn) & MASK64;
  x ^= x >> 33n;
  x = (x * 0xc4ceb9fe1a85ec53n) & MASK64;
  x ^= x >> 33n;
  return x;
}

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--) {
    v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  }
  return v;
}

export function murmur3_128(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: Murmur128Hooks = {},
): { h1: bigint; h2: bigint } {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const nblocks = Math.floor(bytes.length / 16);
  let h1 = seed;
  let h2 = seed;

  for (let i = 0; i < nblocks; i++) {
    const base = i * 16;
    let k1 = readLE64(bytes, base);
    let k2 = readLE64(bytes, base + 8);

    k1 = (k1 * C1) & MASK64;
    k1 = rotl64(k1, 31);
    k1 = (k1 * C2) & MASK64;
    h1 ^= k1;

    h1 = rotl64(h1, 27);
    h1 = (h1 + h2) & MASK64;
    h1 = (h1 * 5n + 0x52dce729n) & MASK64;

    k2 = (k2 * C2) & MASK64;
    k2 = rotl64(k2, 33);
    k2 = (k2 * C1) & MASK64;
    h2 ^= k2;

    h2 = rotl64(h2, 31);
    h2 = (h2 + h1) & MASK64;
    h2 = (h2 * 5n + 0x38495ab5n) & MASK64;

    hooks.onBlock?.(i, h1, h2);
  }

  // tail
  let k1 = 0n;
  let k2 = 0n;
  const tailBase = nblocks * 16;
  const tailLen = bytes.length & 15;
  if (tailLen > 0) {
    if (tailLen >= 15) k2 ^= BigInt(bytes[tailBase + 14]!) << 48n;
    if (tailLen >= 14) k2 ^= BigInt(bytes[tailBase + 13]!) << 40n;
    if (tailLen >= 13) k2 ^= BigInt(bytes[tailBase + 12]!) << 32n;
    if (tailLen >= 12) k2 ^= BigInt(bytes[tailBase + 11]!) << 24n;
    if (tailLen >= 11) k2 ^= BigInt(bytes[tailBase + 10]!) << 16n;
    if (tailLen >= 10) k2 ^= BigInt(bytes[tailBase + 9]!) << 8n;
    if (tailLen >= 9) {
      k2 ^= BigInt(bytes[tailBase + 8]!);
      k2 = (k2 * C2) & MASK64;
      k2 = rotl64(k2, 33);
      k2 = (k2 * C1) & MASK64;
      h2 ^= k2;
    }
    if (tailLen >= 8) k1 ^= BigInt(bytes[tailBase + 7]!) << 56n;
    if (tailLen >= 7) k1 ^= BigInt(bytes[tailBase + 6]!) << 48n;
    if (tailLen >= 6) k1 ^= BigInt(bytes[tailBase + 5]!) << 40n;
    if (tailLen >= 5) k1 ^= BigInt(bytes[tailBase + 4]!) << 32n;
    if (tailLen >= 4) k1 ^= BigInt(bytes[tailBase + 3]!) << 24n;
    if (tailLen >= 3) k1 ^= BigInt(bytes[tailBase + 2]!) << 16n;
    if (tailLen >= 2) k1 ^= BigInt(bytes[tailBase + 1]!) << 8n;
    if (tailLen >= 1) {
      k1 ^= BigInt(bytes[tailBase]!);
      k1 = (k1 * C1) & MASK64;
      k1 = rotl64(k1, 31);
      k1 = (k1 * C2) & MASK64;
      h1 ^= k1;
    }
  }

  h1 ^= BigInt(bytes.length);
  h2 ^= BigInt(bytes.length);
  h1 = (h1 + h2) & MASK64;
  h2 = (h2 + h1) & MASK64;
  h1 = fmix64(h1);
  h2 = fmix64(h2);
  h1 = (h1 + h2) & MASK64;
  h2 = (h2 + h1) & MASK64;

  hooks.onResult?.(h1, h2);
  return { h1, h2 };
}

export function murmur3_128Hex(data: string | readonly number[], seed: bigint = 0n): string {
  const { h1, h2 } = murmur3_128(data, seed);
  return h1.toString(16).padStart(16, '0') + h2.toString(16).padStart(16, '0');
}
