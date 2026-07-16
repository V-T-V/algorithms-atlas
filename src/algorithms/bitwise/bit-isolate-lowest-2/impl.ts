export interface IsoLowHooks {
  onIsolate?: (iso: number) => void;
}
export function isolateLowestBit(x: number, hooks: IsoLowHooks = {}): number {
  const v = x | 0;
  const r = (v & -v) >>> 0;
  hooks.onIsolate?.(r);
  return r;
}
