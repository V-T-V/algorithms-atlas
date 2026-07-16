export interface MaskHooks {
  onResult?: (m: number) => void;
}
export function lowMask(k: number, hooks: MaskHooks = {}): number {
  const n = k | 0;
  if (n <= 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n >= 32) {
    hooks.onResult?.(0xffffffff);
    return 0xffffffff;
  }
  const r = ((1 << n) - 1) >>> 0;
  hooks.onResult?.(r);
  return r;
}
