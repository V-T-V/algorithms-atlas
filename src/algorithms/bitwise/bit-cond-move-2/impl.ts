export interface CmovHooks {
  onMask?: (mask: number) => void;
  onResult?: (r: number) => void;
}
export function selectBit(flag: boolean, a: number, b: number, hooks: CmovHooks = {}): number {
  const mask = (flag ? -1 : 0) | 0;
  hooks.onMask?.(mask >>> 0);
  const r = ((a | 0) & mask) | ((b | 0) & ~mask) | 0;
  hooks.onResult?.(r);
  return r;
}
