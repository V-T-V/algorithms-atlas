export interface CsHooks {
  onPick?: (v: number) => void;
  onResult?: (c: number[]) => void;
}
export function combinationSum(
  candidates: number[],
  target: number,
  hooks: CsHooks = {},
): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number, remain: number) => {
    if (remain === 0) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i]! > remain) continue;
      cur.push(candidates[i]!);
      hooks.onPick?.(candidates[i]!);
      go(i, remain - candidates[i]!);
      cur.pop();
    }
  };
  go(0, target);
  return out;
}
