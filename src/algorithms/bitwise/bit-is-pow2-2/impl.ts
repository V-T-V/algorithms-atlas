export interface IsPow2Hooks {
  onStrip?: (stripped: number) => void;
  onResult?: (r: boolean) => void;
}
export function isPow2Bit(x: number, hooks: IsPow2Hooks = {}): boolean {
  const v = x | 0;
  const stripped = v & (v - 1);
  hooks.onStrip?.(stripped >>> 0);
  const r = v > 0 && stripped === 0;
  hooks.onResult?.(r);
  return r;
}
