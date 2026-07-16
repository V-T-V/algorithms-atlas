export interface RotateHooks {
  onShift?: (dir: 'left' | 'right', r: number) => void;
  onResult?: (v: number) => void;
}
export function rotl(x: number, r: number, hooks: RotateHooks = {}): number {
  const n = ((r % 32) + 32) % 32;
  hooks.onShift?.('left', n);
  const v = ((x << n) | (x >>> (32 - n))) >>> 0;
  hooks.onResult?.(v);
  return v;
}
export function rotr(x: number, r: number, hooks: RotateHooks = {}): number {
  const n = ((r % 32) + 32) % 32;
  hooks.onShift?.('right', n);
  const v = ((x >>> n) | (x << (32 - n))) >>> 0;
  hooks.onResult?.(v);
  return v;
}
