export interface Cs3Hooks {
  onPick?: (v: number) => void;
  onResult?: (c: number[]) => void;
}
export function combinationSum3(k: number, n: number, hooks: Cs3Hooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number, remain: number) => {
    if (cur.length === k && remain === 0) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    if (cur.length >= k) return;
    for (let i = start; i <= 9; i++) {
      if (i > remain) break;
      cur.push(i);
      hooks.onPick?.(i);
      go(i + 1, remain - i);
      cur.pop();
    }
  };
  go(1, n);
  return out;
}
