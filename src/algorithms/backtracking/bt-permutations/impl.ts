export interface PermHooks {
  onPick?: (i: number, v: number) => void;
  onBacktrack?: (i: number) => void;
  onResult?: (p: number[]) => void;
}
export function permutations(arr: number[], hooks: PermHooks = {}): number[][] {
  const out: number[][] = [];
  const a = [...arr];
  const go = (i: number) => {
    if (i === a.length) {
      out.push([...a]);
      hooks.onResult?.([...a]);
      return;
    }
    for (let j = i; j < a.length; j++) {
      [a[i], a[j]] = [a[j]!, a[i]!];
      hooks.onPick?.(i, a[i]!);
      go(i + 1);
      [a[i], a[j]] = [a[j]!, a[i]!];
      hooks.onBacktrack?.(i);
    }
  };
  go(0);
  return out;
}
