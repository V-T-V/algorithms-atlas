export interface SuHooks {
  onPick?: (v: number) => void;
  onResult?: (s: number[]) => void;
}
export function subsetsWithDup(arr: number[], hooks: SuHooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number) => {
    out.push([...cur]);
    hooks.onResult?.([...cur]);
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      cur.push(sorted[i]!);
      hooks.onPick?.(sorted[i]!);
      go(i + 1);
      cur.pop();
    }
  };
  go(0);
  return out;
}
