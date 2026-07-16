// ICE 整数哈希 (Murmur3 finalizer 风格) · 实现
export interface IceHooks {
  onKey?: (key: number, hash: number) => void;
}
export function iceHash(key: number, hooks: IceHooks = {}): number {
  let h = key;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  hooks.onKey?.(key, h >>> 0);
  return h >>> 0;
}
export function iceHashBatch(keys: readonly number[], hooks: IceHooks = {}): number[] {
  return keys.map((k) => iceHash(k, hooks));
}
