// Bernstein 哈希 · 实现
export interface BernsteinHooks {
  onByte?: (i: number, c: number, hash: number) => void;
}

export function bernstein(data: string | readonly number[], hooks: BernsteinHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 5381;
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]!;
    hash = (((hash << 5) + hash) ^ c) >>> 0;
    hooks.onByte?.(i, c, hash);
  }
  return hash >>> 0;
}
