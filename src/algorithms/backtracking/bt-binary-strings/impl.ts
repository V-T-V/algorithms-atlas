export interface BsHooks {
  onBit?: (idx: number, b: number) => void;
  onResult?: (s: string) => void;
}
export function binaryStrings(n: number, hooks: BsHooks = {}): string[] {
  const out: string[] = [];
  const cur: number[] = [];
  const go = (i: number) => {
    if (i === n) {
      out.push(cur.join(''));
      hooks.onResult?.(cur.join(''));
      return;
    }
    for (const b of [0, 1]) {
      cur[i] = b;
      hooks.onBit?.(i, b);
      go(i + 1);
    }
  };
  go(0);
  return out;
}
