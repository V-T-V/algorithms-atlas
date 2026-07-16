export interface ModPow2Hooks {
  onMask?: (mask: number) => void;
  onResult?: (r: number) => void;
}
export function modPow2(x: number, m: number, hooks: ModPow2Hooks = {}): number {
  if ((m & (m - 1)) !== 0 || m <= 0) throw new RangeError('m 必须是正的 2 的幂');
  const mask = m - 1;
  hooks.onMask?.(mask);
  const r = (x | 0) & mask;
  hooks.onResult?.(r);
  return r;
}
