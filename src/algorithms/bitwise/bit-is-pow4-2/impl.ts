export interface IsPow4Hooks {
  onResult?: (r: boolean) => void;
}
export function isPow4Bit(x: number, hooks: IsPow4Hooks = {}): boolean {
  const v = x | 0;
  const r = v > 0 && (v & (v - 1)) === 0 && (v & 0x55555555) !== 0;
  hooks.onResult?.(r);
  return r;
}
