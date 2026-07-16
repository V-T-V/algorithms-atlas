export interface CfHooks {
  onLevel?: (resolution: number, candidates: number[]) => void;
  onRefine?: (resolution: number) => void;
  onFound?: (pos: number) => void;
}
export interface CfProblem {
  domain: number[];
  goal: number;
  near: (a: number, b: number, res: number) => boolean;
  levels: number;
}
export function coarseToFineSearch(p: CfProblem, hooks: CfHooks = {}): number {
  let candidates = p.domain;
  for (let L = p.levels; L >= 0; L--) {
    hooks.onLevel?.(L, candidates);
    const scored = candidates
      .map((c) => ({ c, score: Math.abs(c - p.goal) }))
      .sort((a, b) => a.score - b.score);
    const best = scored[0]!.c;
    if (best === p.goal) {
      hooks.onFound?.(best);
      return best;
    }
    // 在最佳候选附近以 1/2^L 分辨率展开
    candidates = p.domain.filter((c) => p.near(c, best, Math.pow(2, L)));
    hooks.onRefine?.(L - 1);
  }
  hooks.onFound?.(candidates[0] ?? -1);
  return candidates[0] ?? -1;
}
