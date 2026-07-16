// CityHash64 简化 BigInt · 实现
const MASK = (1n << 64n) - 1n;
const K0 = 0xc3a5c85c97cb3127n;
const K1 = 0xb492b66fbe98f273n;
const K2 = 0x9ae16a3b2f90404fn;
function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK;
}
export interface City64Hooks {
  onOctet?: (i: number, byte: number, hash: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashCity64(
  data: string | readonly number[],
  seed = 0n,
  hooks: City64Hooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let h = (seed ^ (BigInt(bytes.length) * K2)) & MASK;
  for (let i = 0; i < bytes.length; i++) {
    h = (h + BigInt(bytes[i]!) * K0) & MASK;
    h = rotl64(h, 21) ^ (h >> 37n);
    hooks.onOctet?.(i, bytes[i]!, h);
  }
  h = (h ^ (h >> 33n)) & MASK;
  h = (h * K1) & MASK;
  h = (h ^ (h >> 29n)) & MASK;
  h = (h * K2) & MASK;
  h = (h ^ (h >> 35n)) & MASK;
  hooks.onResult?.(h);
  return h;
}
