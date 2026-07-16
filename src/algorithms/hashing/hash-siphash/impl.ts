// SipHash-2-4 64 位 · 实现
const MASK64 = (1n << 64n) - 1n;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}

export interface SipHashHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

function sipround(
  v0: bigint,
  v1: bigint,
  v2: bigint,
  v3: bigint,
): [bigint, bigint, bigint, bigint] {
  v0 = (v0 + v1) & MASK64;
  v1 = rotl64(v1, 13);
  v1 = (v1 ^ v0) & MASK64;
  v0 = rotl64(v0, 32);
  v2 = (v2 + v3) & MASK64;
  v3 = rotl64(v3, 16);
  v3 = (v3 ^ v2) & MASK64;
  v0 = (v0 + v3) & MASK64;
  v3 = rotl64(v3, 21);
  v3 = (v3 ^ v0) & MASK64;
  v2 = (v2 + v1) & MASK64;
  v1 = rotl64(v1, 17);
  v1 = (v1 ^ v2) & MASK64;
  v2 = rotl64(v2, 32);
  return [v0, v1, v2, v3];
}

export function siphash24(
  data: string | readonly number[],
  key: bigint = 0x0123456789abcdefn,
  hooks: SipHashHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const k0 = key & MASK64;
  const k1 = (key ^ 0xdeadbeefcafebaben) & MASK64;
  let v0 = (0x736f6d6570736575n ^ k0) & MASK64;
  let v1 = (0x646f72616e646f6dn ^ k1) & MASK64;
  let v2 = (0x6c7967656e657261n ^ k0) & MASK64;
  let v3 = (0x7465646279746573n ^ k1) & MASK64;

  const nblocks = Math.floor(bytes.length / 8);
  for (let i = 0; i < nblocks; i++) {
    const m = readLE64(bytes, i * 8);
    v3 = (v3 ^ m) & MASK64;
    [v0, v1, v2, v3] = sipround(v0, v1, v2, v3);
    [v0, v1, v2, v3] = sipround(v0, v1, v2, v3);
    v0 = (v0 ^ m) & MASK64;
    hooks.onBlock?.(i, v0);
  }

  // 最后块：剩余字节 + 长度模 256
  let last = BigInt((bytes.length & 7) << 24) | BigInt(bytes.length << 24);
  last = last & MASK64;
  const tailBase = nblocks * 8;
  const tailLen = bytes.length & 7;
  let b = last;
  if (tailLen >= 7) b |= BigInt(bytes[tailBase + 6]!) << 48n;
  if (tailLen >= 6) b |= BigInt(bytes[tailBase + 5]!) << 40n;
  if (tailLen >= 5) b |= BigInt(bytes[tailBase + 4]!) << 32n;
  if (tailLen >= 4) b |= BigInt(bytes[tailBase + 3]!) << 24n;
  if (tailLen >= 3) b |= BigInt(bytes[tailBase + 2]!) << 16n;
  if (tailLen >= 2) b |= BigInt(bytes[tailBase + 1]!) << 8n;
  if (tailLen >= 1) b |= BigInt(bytes[tailBase]!);
  b = b & MASK64;

  v3 = (v3 ^ b) & MASK64;
  [v0, v1, v2, v3] = sipround(v0, v1, v2, v3);
  [v0, v1, v2, v3] = sipround(v0, v1, v2, v3);
  v0 = (v0 ^ b) & MASK64;

  v2 = (v2 ^ 0xffn) & MASK64;
  for (let r = 0; r < 4; r++) [v0, v1, v2, v3] = sipround(v0, v1, v2, v3);

  const hash = (v0 ^ v1 ^ v2 ^ v3) & MASK64;
  hooks.onResult?.(hash);
  return hash;
}
