// BLAKE2b (简化 256 位) · 实现
const MASK64 = (1n << 64n) - 1n;

const IV: bigint[] = [
  0x6a09e667f3bcc908n,
  0xbb67ae8584caa73bn,
  0x3c6ef372fe94f82bn,
  0xa54ff53a5f1d36f1n,
  0x510e527fade682d1n,
  0x9b05688c2b3e6c1fn,
  0x1f83d9abfb41bd6bn,
  0x5be0cd19137e2179n,
];

const SIGMA: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
];

function rotl64(x: bigint, r: number): bigint {
  const rr = BigInt(r);
  return ((x << rr) | (x >> (64n - rr))) & MASK64;
}

function readLE64(bytes: readonly number[], offset: number): bigint {
  let v = 0n;
  for (let i = 7; i >= 0; i--) {
    if (offset + i < bytes.length) v = (v << 8n) | BigInt(bytes[offset + i]! & 0xff);
  }
  return v;
}

export interface Blake2Hooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: string) => void;
}

function G(v: bigint[], a: number, b: number, c: number, d: number, x: bigint, y: bigint): void {
  v[a] = (v[a]! + v[b]! + x) & MASK64;
  v[d] = rotl64(v[d]! ^ v[a]!, 32);
  v[c] = (v[c]! + v[d]!) & MASK64;
  v[b] = rotl64(v[b]! ^ v[c]!, 24);
  v[a] = (v[a]! + v[b]! + y) & MASK64;
  v[d] = rotl64(v[d]! ^ v[a]!, 16);
  v[c] = (v[c]! + v[d]!) & MASK64;
  v[b] = rotl64(v[b]! ^ v[c]!, 63);
}

function compress(h: bigint[], block: bigint[], t: bigint, last: boolean): bigint[] {
  const v = [...h, ...IV];
  v[12] = (v[12]! ^ (t & MASK64)) & MASK64;
  v[14] = (v[14]! ^ (last ? 0xffffffffffffffffn : 0n)) & MASK64;
  for (let r = 0; r < 12; r++) {
    const s = SIGMA[r]!;
    G(v, 0, 4, 8, 12, block[s[0]!]!, block[s[1]!]!);
    G(v, 1, 5, 9, 13, block[s[2]!]!, block[s[3]!]!);
    G(v, 2, 6, 10, 14, block[s[4]!]!, block[s[5]!]!);
    G(v, 3, 7, 11, 15, block[s[6]!]!, block[s[7]!]!);
    G(v, 0, 5, 10, 15, block[s[8]!]!, block[s[9]!]!);
    G(v, 1, 6, 11, 12, block[s[10]!]!, block[s[11]!]!);
    G(v, 2, 7, 8, 13, block[s[12]!]!, block[s[13]!]!);
    G(v, 3, 4, 9, 14, block[s[14]!]!, block[s[15]!]!);
  }
  return h.map((hi, i) => (hi ^ v[i]! ^ v[i + 8]!) & MASK64);
}

export function blake2b(
  data: string | readonly number[],
  outlen: number = 32,
  hooks: Blake2Hooks = {},
): bigint[] {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let h = IV.map((hi, i) => (i === 0 ? (hi ^ (0x01010000n ^ BigInt(outlen))) & MASK64 : hi));
  let t = 0n;
  if (bytes.length === 0) {
    h = compress(h, new Array(16).fill(0n), 0n, true);
  } else {
    const nblocks = Math.ceil(bytes.length / 128);
    for (let i = 0; i < nblocks; i++) {
      const base = i * 128;
      const block: bigint[] = [];
      for (let j = 0; j < 16; j++) block.push(readLE64(bytes, base + j * 8));
      t = (t + BigInt(Math.min(128, bytes.length - base))) & MASK64;
      h = compress(h, block, t, i === nblocks - 1);
      hooks.onBlock?.(i);
    }
  }
  const out: bigint[] = [];
  for (let i = 0; i < Math.ceil(outlen / 8); i++) out.push(h[i]!);
  hooks.onResult?.(out.map((x) => x.toString(16).padStart(16, '0')).join(''));
  return out;
}
