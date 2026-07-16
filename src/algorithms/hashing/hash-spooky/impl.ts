// SpookyHash V2 简化版 · 实现
const MASK64 = (1n << 64n) - 1n;
const SC = 0xdeadbeefdeadbeefn;

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}
function mul64(a: bigint, b: bigint): bigint {
  return (a * b) & MASK64;
}

export interface SpookyHooks {
  onBlock?: (i: number, acc: bigint) => void;
  onResult?: (hash: bigint) => void;
}

export function spookyHash64(
  data: string | readonly number[],
  seed: bigint = 0n,
  hooks: SpookyHooks = {},
): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  const n = bytes.length;
  let h = mul64(seed ^ SC, K0());
  for (let i = 0; i < n; i++) {
    h = mul64(h ^ BigInt(bytes[i]!), K1());
    h = rotl64(h, 21) ^ (h >> 5n);
    hooks.onBlock?.(i, h);
  }
  h = mul64(h ^ BigInt(n), K0());
  h = mul64(h ^ (h >> 33n), K1());
  h = mul64(h ^ (h >> 29n), K0());
  h = mul64(h ^ (h >> 32n), K1());
  hooks.onResult?.(h);
  return h;
}
function K0(): bigint {
  return 0xa0761d6478bd642fn;
}
function K1(): bigint {
  return 0xe7037ed1a0b428dbn;
}
