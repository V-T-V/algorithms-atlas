export interface SkHooks {
  onPick?: (v: number) => void;
  onResult?: (s: number[]) => void;
}
export function subsetsOfSizeK(n: number, k: number, hooks: SkHooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number) => {
    if (cur.length === k) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (let i = start; i <= n; i++) {
      cur.push(i);
      hooks.onPick?.(i);
      go(i + 1);
      cur.pop();
    }
  };
  go(1);
  return out;
}
