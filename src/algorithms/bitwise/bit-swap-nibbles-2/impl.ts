export interface NibbleSwapHooks {
  onResult?: (v: number) => void;
}
export function swapNibbles(x: number, hooks: NibbleSwapHooks = {}): number {
  const v = x & 0xff;
  const r = (((v & 0x0f) << 4) | ((v & 0xf0) >>> 4)) & 0xff;
  hooks.onResult?.(r);
  return r;
}
