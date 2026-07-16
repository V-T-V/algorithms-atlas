export interface McuHooks {
  onPick?: (i: number, len: number) => void;
  onResult?: (max: number) => void;
}
function mask(s: string): number {
  let m = 0;
  for (const ch of s) {
    const b = 1 << (ch.charCodeAt(0) - 97);
    if (m & b) return -1;
    m |= b;
  }
  return m;
}
export function maxLength(arr: string[], hooks: McuHooks = {}): number {
  const masks = arr.map(mask);
  let best = 0;
  const go = (i: number, curMask: number, curLen: number) => {
    if (i === arr.length) {
      best = Math.max(best, curLen);
      return;
    }
    go(i + 1, curMask, curLen);
    const m = masks[i]!;
    if (m > 0 && (curMask & m) === 0) {
      hooks.onPick?.(i, curLen + arr[i]!.length);
      go(i + 1, curMask | m, curLen + arr[i]!.length);
    }
  };
  go(0, 0, 0);
  hooks.onResult?.(best);
  return best;
}
