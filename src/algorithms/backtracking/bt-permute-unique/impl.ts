export interface PuHooks {
  onPick?: (v: number) => void;
  onResult?: (p: number[]) => void;
}
export function permuteUnique(arr: number[], hooks: PuHooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const out: number[][] = [];
  const cur: number[] = [];
  const used = new Array(sorted.length).fill(false);
  const go = () => {
    if (cur.length === sorted.length) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i] || (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1])) continue;
      used[i] = true;
      cur.push(sorted[i]!);
      hooks.onPick?.(sorted[i]!);
      go();
      cur.pop();
      used[i] = false;
    }
  };
  go();
  return out;
}
