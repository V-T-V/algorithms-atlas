// xxHash64 · 实现
const MASK64 = (1n << 64n) - 1n;
const P1 = 11400714785074694791n;
const P2 = 14029467366897019727n;
const P3 = 1609587929392839161n;
const P4 = 9650029242287828579n;
const P5 = 2870177450012600261n;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}

export interface Xxh64Hooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function xxh64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: Xxh64Hooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash: bigint;
  if (bytes.length >= 32) {
    let v1 = (seed + P1 + P2) & MASK64;
    let v2 = (seed + P2) & MASK64;
    let v3 = seed;
    let v4 = (seed - P1) & MASK64;
    let i = 0;
    for (; i + 32 <= bytes.length; i += 32) {
      v1 = (rotl64((v1 + ((readLE64(bytes, i) * P2) & MASK64)) & MASK64, 31) * P1) & MASK64;
      v2 = (rotl64((v2 + ((readLE64(bytes, i + 8) * P2) & MASK64)) & MASK64, 31) * P1) & MASK64;
      v3 = (rotl64((v3 + ((readLE64(bytes, i + 16) * P2) & MASK64)) & MASK64, 31) * P1) & MASK64;
      v4 = (rotl64((v4 + ((readLE64(bytes, i + 24) * P2) & MASK64)) & MASK64, 31) * P1) & MASK64;
      hooks.onBlock?.(i / 32, v1);
    }
    hash = (rotl64(v1, 1) + rotl64(v2, 7) + rotl64(v3, 12) + rotl64(v4, 18)) & MASK64;
    hash = (hash + (((v1 * P2) & MASK64) << 0n)) & MASK64;
    hash = (rotl64(hash, 27) * P1) & MASK64;
    // 简化合并（标准算法更复杂）
    hash = (hash + ((v2 * P3) & MASK64)) & MASK64;
    hash = (hash + ((v3 * P3) & MASK64)) & MASK64;
    hash = (hash + ((v4 * P3) & MASK64)) & MASK64;
    hash = (hash + v3) & MASK64;
  } else {
    hash = (seed + P5) & MASK64;
  }
  hash = (hash + BigInt(bytes.length)) & MASK64;
  // tail
  let i = bytes.length >= 32 ? Math.floor(bytes.length / 32) * 32 : 0;
  while (i + 8 <= bytes.length) {
    const k1 = (rotl64((readLE64(bytes, i) * P2) & MASK64, 31) * P1) & MASK64;
    hash = (rotl64((hash ^ k1) & MASK64, 27) * P1 + P4) & MASK64;
    i += 8;
  }
  if (i + 4 <= bytes.length) {
    hash =
      (rotl64(
        hash ^
          ((BigInt(
            bytes[i]! | (bytes[i + 1]! << 8) | (bytes[i + 2]! << 16) | (bytes[i + 3]! << 24),
          ) *
            P1) &
            MASK64),
        23,
      ) *
        P2 +
        P3) &
      MASK64;
    i += 4;
  }
  while (i < bytes.length) {
    hash = (rotl64((hash ^ (BigInt(bytes[i]!) * P5)) & MASK64, 11) * P1) & MASK64;
    i++;
  }
  // avalanche
  hash ^= hash >> 33n;
  hash = (hash * P2) & MASK64;
  hash ^= hash >> 29n;
  hash = (hash * P3) & MASK64;
  hash ^= hash >> 32n;
  hooks.onResult?.(hash);
  return hash;
}
