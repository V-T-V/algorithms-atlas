export interface CtzHooks {
  onIsolate?: (iso: number) => void;
  onResult?: (r: number) => void;
}
export function ctz32(x: number, hooks: CtzHooks = {}): number {
  const v = x | 0;
  if (v === 0) return 32;
  const iso = (v & -v) >>> 0; // 最低位的 1
  hooks.onIsolate?.(iso);
  // de Bruijn 查表法
  const SEQ = 0x077cb531;
  const TBL = [
    0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 31, 27, 13, 23, 21, 19, 16, 7, 26, 12,
    18, 6, 11, 10, 9, 5,
  ];
  const idx = ((iso * SEQ) >>> 27) & 31;
  const r = TBL[idx]!;
  hooks.onResult?.(r);
  return r;
}
