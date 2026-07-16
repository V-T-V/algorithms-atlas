// BLAKE3 简化版 · 实现
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

const MSG_PERMUTATION = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];

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
function g(v: bigint[], a: number, b: number, c: number, d: number, mx: bigint, my: bigint): void {
  v[a] = (v[a]! + v[b]! + mx) & MASK64;
  v[d] = rotl64(v[d]! ^ v[a]!, 32);
  v[c] = (v[c]! + v[d]!) & MASK64;
  v[b] = rotl64(v[b]! ^ v[c]!, 24);
  v[a] = (v[a]! + v[b]! + my) & MASK64;
  v[d] = rotl64(v[d]! ^ v[a]!, 16);
  v[c] = (v[c]! + v[d]!) & MASK64;
  v[b] = rotl64(v[b]! ^ v[c]!, 63);
}

function round(v: bigint[], m: bigint[]): void {
  // 列混合
  g(v, 0, 4, 8, 12, m[0]!, m[1]!);
  g(v, 1, 5, 9, 13, m[2]!, m[3]!);
  g(v, 2, 6, 10, 14, m[4]!, m[5]!);
  g(v, 3, 7, 11, 15, m[6]!, m[7]!);
  // 对角混合
  g(v, 0, 5, 10, 15, m[8]!, m[9]!);
  g(v, 1, 6, 11, 12, m[10]!, m[11]!);
  g(v, 2, 7, 8, 13, m[12]!, m[13]!);
  g(v, 3, 4, 9, 14, m[14]!, m[15]!);
}

function permute(m: bigint[]): bigint[] {
  return MSG_PERMUTATION.map((p) => m[p]!);
}

function compress(
  chaining: bigint[],
  blockWords: bigint[],
  blockLen: bigint,
  flags: bigint,
): bigint[] {
  const blockFlags = 0n; // CHUNK_START | CHUNK_END bits simplified
  const state = [...chaining, ...IV, 0n, blockLen, blockFlags, flags];
  let m = [...blockWords];
  for (let r = 0; r < 7; r++) {
    round(state, m);
    m = permute(m);
  }
  const out: bigint[] = [];
  for (let i = 0; i < 8; i++) out.push((state[i]! ^ state[i + 8]!) & MASK64);
  return out;
}

export interface Blake3Hooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: string) => void;
}

export function blake3(data: string | readonly number[], hooks: Blake3Hooks = {}): bigint[] {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let chaining = IV.map((hi) => (hi ^ 0x01010000n) & MASK64);
  const CHUNK = 64; // 简化为单块链模式（实际 1024）
  const nchunks = Math.max(1, Math.ceil(bytes.length / CHUNK));
  for (let c = 0; c < nchunks; c++) {
    const base = c * CHUNK;
    const blockWords: bigint[] = [];
    for (let j = 0; j < 8; j++) blockWords.push(readLE64(bytes, base + j * 8));
    while (blockWords.length < 16) blockWords.push(0n);
    const blockLen = BigInt(Math.min(CHUNK, bytes.length - base));
    const flags = c === nchunks - 1 ? 0x08n : 0n; // CHUNK_END
    chaining = compress(chaining, blockWords, blockLen, flags);
    hooks.onBlock?.(c);
  }
  const out = chaining.slice(0, 4);
  hooks.onResult?.(out.map((x) => x.toString(16).padStart(16, '0')).join(''));
  return out;
}
