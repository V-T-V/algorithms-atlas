export interface CombHooks {
  onPick?: (v: number) => void;
  onBacktrack?: () => void;
  onResult?: (c: number[]) => void;
}
export function combine(n: number, k: number, hooks: CombHooks = {}): number[][] {
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
      hooks.onBacktrack?.();
    }
  };
  go(1);
  return out;
}
