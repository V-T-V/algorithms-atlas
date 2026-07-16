// 蝙蝠算法 · 实现
export interface BatHooks2 {
  onIter?: (i: number, best: number[], bestFit: number) => void;
  onConclude?: (best: number[], bestFit: number) => void;
}
export function bat(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 15,
  maxIter = 40,
  hooks: BatHooks2 = {},
): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const vel = Array.from({ length: n }, () => new Array<number>(dim).fill(0));
  let gBest = [...pos[0]!],
    gFit = f(pos[0]!);
  for (let i = 1; i < n; i++) {
    const fit = f(pos[i]!);
    if (fit < gFit) {
      gFit = fit;
      gBest = [...pos[i]!];
    }
  }
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      const freq = 0.25 + Math.random() * 0.5;
      for (let d = 0; d < dim; d++) {
        vel[i]![d]! += (pos[i]![d]! - gBest[d]!) * freq;
        pos[i]![d]! += vel[i]![d]! * 0.5;
      }
      if (Math.random() > 0.5)
        for (let d = 0; d < dim; d++) pos[i]![d] = gBest[d]! + (Math.random() - 0.5) * 0.5;
      const fit = f(pos[i]!);
      if (fit < gFit) {
        gFit = fit;
        gBest = [...pos[i]!];
      }
    }
    hooks.onIter?.(it, [...gBest], gFit);
  }
  hooks.onConclude?.(gBest, gFit);
  return { best: gBest, bestFit: gFit };
}
