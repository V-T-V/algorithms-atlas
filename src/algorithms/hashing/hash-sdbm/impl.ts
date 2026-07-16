// SDBM 哈希 · 实现
export interface SdbmHooks {
  onByte?: (i: number, c: number, hash: number) => void;
}

export function sdbm(data: string | readonly number[], hooks: SdbmHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]!;
    hash = (c + (hash << 6) + (hash << 16) - hash) >>> 0;
    hooks.onByte?.(i, c, hash);
  }
  return hash >>> 0;
}
