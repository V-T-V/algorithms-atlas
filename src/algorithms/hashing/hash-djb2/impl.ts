// =============================================================================
// DJB2 哈希 · 纯算法实现
// =============================================================================

export interface Djb2Hooks {
  onByte?: (i: number, c: number, hash: number) => void;
}

/** 32 位 DJB2。 */
export function djb2(data: string | readonly number[], hooks: Djb2Hooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 5381;
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash << 5) + hash + bytes[i]!) >>> 0;
    hooks.onByte?.(i, bytes[i]!, hash);
  }
  return hash >>> 0;
}

/** DJB2 变种 XOR 版：hash*33 ^ c。 */
export function djb2a(data: string | readonly number[]): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 5381;
  for (const b of bytes) {
    hash = (((hash << 5) + hash) ^ b) >>> 0;
  }
  return hash >>> 0;
}
