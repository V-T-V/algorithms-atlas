export interface MaxBitHooks {
  onMask?: (mask: number) => void;
  onResult?: (m: number) => void;
}
export function maxBit(a: number, b: number, hooks: MaxBitHooks = {}): number {
  const x = a | 0,
    y = b | 0;
  const diff = (x - y) | 0;
  const mask = diff >> 31;
  hooks.onMask?.(mask >>> 0);
  const r = (x - (diff & mask)) | 0;
  hooks.onResult?.(r);
  return r;
}
