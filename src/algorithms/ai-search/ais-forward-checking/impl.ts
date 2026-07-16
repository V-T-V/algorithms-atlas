export interface FcHooks {
  onAssign?: (varIdx: number, val: number) => void;
  onPrune?: (varIdx: number, val: number) => void;
  onFound?: (assign: number[]) => void;
}
export interface FcProblem {
  n: number;
  domain: number[];
  conflict: (i: number, vi: number, j: number, vj: number) => boolean;
  edges: Array<[number, number]>;
}
export function forwardChecking(p: FcProblem, hooks: FcHooks = {}): number[] | null {
  const domains: number[][] = Array.from({ length: p.n }, () => [...p.domain]);
  const assign: number[] = [];
  const neighbors = (i: number): number[] =>
    p.edges.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));
  const solve = (idx: number): boolean => {
    if (idx >= p.n) return true;
    for (const v of domains[idx]!) {
      hooks.onAssign?.(idx, v);
      const removed: Array<[number, number]> = [];
      let dead = false;
      for (const j of neighbors(idx)) {
        if (assign[j] !== undefined) continue;
        for (const w of [...domains[j]!]) {
          if (p.conflict(idx, v, j, w)) {
            domains[j] = domains[j]!.filter((x) => x !== w);
            removed.push([j, w]);
            hooks.onPrune?.(j, w);
            if (domains[j]!.length === 0) dead = true;
          }
        }
      }
      if (!dead) {
        assign[idx] = v;
        if (solve(idx + 1)) return true;
        assign[idx] = undefined!;
      }
      for (const [j, w] of removed) domains[j]!.push(w);
    }
    return false;
  };
  const ok = solve(0);
  if (ok) hooks.onFound?.(assign);
  return ok ? assign : null;
}
