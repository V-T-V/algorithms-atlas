export interface DivPow2Hooks {
  onShift?: (k: number, biased: number) => void;
  onResult?: (r: number) => void;
}
export function divPow2(x: number, k: number, hooks: DivPow2Hooks = {}): number {
  if (k < 0 || k > 31) throw new RangeError('k ∈ [0,31]');
  const v = x | 0;
  if (k === 0) {
    hooks.onResult?.(v);
    return v;
  }
  const bias = v < 0 ? (1 << k) - 1 : 0;
  const biased = (v + bias) | 0;
  hooks.onShift?.(k, biased);
  const r = biased >> k;
  hooks.onResult?.(r);
  return r;
}
