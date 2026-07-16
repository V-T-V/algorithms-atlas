// FNV-1a 64 位 · 实现
const MASK64 = (1n << 64n) - 1n;
const OFFSET = 14695981039346656037n;
const PRIME = 1099511628211n;

export interface Fnv64Hooks {
  onByte?: (i: number, c: number, hash: bigint) => void;
}

export function fnv1a64(data: string | readonly number[], hooks: Fnv64Hooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i]!);
    hash = (hash * PRIME) & MASK64;
    hooks.onByte?.(i, bytes[i]!, hash);
  }
  return hash;
}
