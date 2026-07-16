export interface SfHooks {
  onNum?: (v: number) => void;
  onResult?: (seq: number[]) => void;
}
export function splitIntoFib(s: string, hooks: SfHooks = {}): number[] {
  const out: number[] = [];
  const cur: number[] = [];
  const go = (idx: number): boolean => {
    if (idx === s.length && cur.length >= 3) {
      out.push(...cur);
      return true;
    }
    for (let i = idx + 1; i <= s.length; i++) {
      const piece = s.slice(idx, i);
      if (piece.length > 1 && piece[0] === '0') break;
      const v = Number(piece);
      if (v > 2147483647) break;
      if (cur.length >= 2) {
        const sum = cur[cur.length - 1]! + cur[cur.length - 2]!;
        if (v < sum) continue;
        if (v > sum) break;
      }
      cur.push(v);
      hooks.onNum?.(v);
      if (go(i)) return true;
      cur.pop();
    }
    return false;
  };
  go(0);
  hooks.onResult?.(out);
  return out;
}
