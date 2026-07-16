// 掩码求最小 · 实现
export interface MinBitHooks {
  onMask?: (mask: number) => void;
  onResult?: (m: number) => void;
}
export function minBit(a: number, b: number, hooks: MinBitHooks = {}): number {
  const x = a | 0,
    y = b | 0;
  const diff = (x - y) | 0;
  const mask = diff >> 31;
  hooks.onMask?.(mask >>> 0);
  const r = (y + (diff & mask)) | 0;
  hooks.onResult?.(r);
  return r;
}
