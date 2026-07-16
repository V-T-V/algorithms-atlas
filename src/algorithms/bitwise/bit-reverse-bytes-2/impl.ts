export interface BSwapHooks {
  onResult?: (v: number) => void;
}
export function bswap32(x: number, hooks: BSwapHooks = {}): number {
  const v = x >>> 0;
  const r = (((v & 0xff) << 24) | ((v & 0xff00) << 8) | ((v >>> 8) & 0xff00) | (v >>> 24)) >>> 0;
  hooks.onResult?.(r);
  return r;
}
