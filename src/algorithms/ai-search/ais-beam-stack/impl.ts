export interface BsHooks {
  onLayer?: (depth: number, beam: number[]) => void;
  onPrune?: (depth: number, kept: number, pruned: number) => void;
}
export interface BsProblem {
  start: number;
  goal: number;
  expand: (n: number) => number[];
  eval: (n: number) => number;
  beamWidth: number;
  maxDepth: number;
}
export function beamStackSearch(p: BsProblem, hooks: BsHooks = {}): number[] | null {
  let beam = [p.start];
  for (let d = 0; d < p.maxDepth; d++) {
    hooks.onLayer?.(d, beam);
    const next: number[] = [];
    for (const n of beam) for (const c of p.expand(n)) next.push(c);
    if (!next.length) return null;
    next.sort((a, b) => p.eval(a) - p.eval(b));
    const kept = next.slice(0, p.beamWidth);
    hooks.onPrune?.(d, kept.length, next.length - kept.length);
    if (kept.some((n) => n === p.goal)) return kept;
    beam = kept;
  }
  return null;
}
