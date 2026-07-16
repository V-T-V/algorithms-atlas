export interface ClearLowHooks {
  onCleared?: (before: number, after: number) => void;
}
export function clearLowestBit(x: number, hooks: ClearLowHooks = {}): number {
  const v = x | 0;
  const r = (v & (v - 1)) | 0;
  hooks.onCleared?.(v >>> 0, r >>> 0);
  return r;
}
