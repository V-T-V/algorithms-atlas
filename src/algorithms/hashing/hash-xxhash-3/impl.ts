// XXH3 64 简化版 · 实现
const MASK64 = (1n << 64n) - 1n;
const PRIME64_1 = 0x9e3779b185ebca87n;
const PRIME64_2 = 0xc2b2ae3d27d4eb4fn;
const PRIME64_3 = 0x165667b19e3779f9n;
const PRIME64_4 = 0x85ebca77c2b2ae63n;
const PRIME64_5 = 0x27d4eb2f165667c5n;

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--)
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
function readLE32(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 3; i >= 0; i--)
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  return v;
}
function mul64(a: bigint, b: bigint): bigint {
  return (a * b) & MASK64;
}
function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}
function rrmxmx(h: bigint, _n: bigint): bigint {
  h = mul64(h ^ rotl64(h, 49) ^ rotl64(h, 24), PRIME64_2);
  h = mul64(h ^ (h >> 15n), PRIME64_1);
  return h;
}

export interface XXH3Hooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function xxh3_64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: XXH3Hooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const n = bytes.length;
  let h: bigint;
  if (n <= 16) {
    // 短输入路径
    if (n >= 4) {
      h = mul64((readLE32(bytes, 0) ^ readLE32(bytes, n - 4)) + 1n + seed, PRIME64_1);
      h = (h + BigInt(n)) & MASK64;
      h = mul64(h ^ (h >> 23n), PRIME64_2);
      h = mul64(h ^ (h >> 37n), PRIME64_1);
      h = mul64(h ^ (h >> 28n), PRIME64_1);
    } else if (n > 0) {
      let acc = mul64(seed + BigInt(n), PRIME64_1);
      for (let i = 0; i < n; i++) acc = mul64(acc ^ (BigInt(bytes[i]!) * PRIME64_5), PRIME64_2);
      h = mul64(acc ^ (acc >> 11n), PRIME64_1);
    } else {
      h = mul64(seed ^ PRIME64_4, PRIME64_1);
    }
  } else {
    // 长输入：每 16 字节 accumulate
    h = mul64(seed + BigInt(n) * PRIME64_1, PRIME64_1);
    let acc1 = h;
    let acc2 = mul64(h ^ PRIME64_2, PRIME64_2);
    const nblocks = Math.floor(n / 16);
    for (let i = 0; i < nblocks; i++) {
      const lane1 = readLE64(bytes, i * 16);
      const lane2 = readLE64(bytes, i * 16 + 8);
      acc1 = mul64(rotl64(acc1 + mul64(lane1, PRIME64_2), 31), PRIME64_1);
      acc2 = mul64(rotl64(acc2 + mul64(lane2, PRIME64_1), 27), PRIME64_2);
      hooks.onBlock?.(i, acc1 ^ acc2);
    }
    h = rrmxmx((acc1 + acc2) & MASK64, BigInt(n));
    // 尾部
    const tailBase = nblocks * 16;
    if (tailBase < n) {
      let tail = 0n;
      const tailLen = n - tailBase;
      for (let i = 0; i < tailLen; i++)
        tail = (tail << 8n) | BigInt(bytes[tailBase + tailLen - 1 - i]!);
      h = mul64(h ^ mul64(tail, PRIME64_5), PRIME64_4);
    }
  }
  h = mul64(h ^ (h >> 37n), PRIME64_3);
  h = mul64(h ^ (h >> 28n), PRIME64_4);
  hooks.onResult?.(h);
  return h;
}
