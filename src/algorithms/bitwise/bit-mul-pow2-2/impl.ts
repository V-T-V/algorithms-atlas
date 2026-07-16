export interface MulPow2Hooks {
  onShift?: (k: number) => void;
  onResult?: (r: number) => void;
}
export function mulPow2(x: number, k: number, hooks: MulPow2Hooks = {}): number {
  const n = ((k % 32) + 32) % 32;
  hooks.onShift?.(n);
  const r = ((x | 0) << n) | 0;
  hooks.onResult?.(r);
  return r;
}
