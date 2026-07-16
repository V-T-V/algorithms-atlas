// FNV-1a 64-bit · 实现
const OFFSET = 14695981039346656037n;
const PRIME = 1099511628211n;
const MASK = (1n << 64n) - 1n;
export interface Fnv1a64Hooks {
  onOctet?: (i: number, byte: number, hash: bigint) => void;
  onResult?: (hash: bigint) => void;
}
export function hashFnv1a64(data: string | readonly number[], hooks: Fnv1a64Hooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = OFFSET;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash ^ BigInt(bytes[i]!)) & MASK;
    hash = (hash * PRIME) & MASK;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  hooks.onResult?.(hash);
  return hash;
}
