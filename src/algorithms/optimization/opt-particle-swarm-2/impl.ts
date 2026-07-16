// 粒子群优化 · 实现
export interface PsoHooks2 {
  onIter?: (i: number, gBest: number[], gFit: number) => void;
  onConclude?: (gBest: number[], gFit: number) => void;
}
export function particleSwarm(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 20,
  maxIter = 50,
  hooks: PsoHooks2 = {},
): { gBest: number[]; gFit: number } {
  const pos = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const vel = Array.from({ length: n }, () => new Array<number>(dim).fill(0));
  const pBest = pos.map((p) => [...p]);
  const pFit = pos.map((p) => f(p));
  let gBest = [...pBest[pFit.reduce((best, _, i) => (pFit[i]! < pFit[best]! ? i : best), 0)]!];
  let gFit = Math.min(...pFit);
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const r1 = Math.random(),
          r2 = Math.random();
        vel[i]![d] =
          0.7 * vel[i]![d]! +
          1.5 * r1 * (pBest[i]![d]! - pos[i]![d]!) +
          1.5 * r2 * (gBest[d]! - pos[i]![d]!);
        pos[i]![d]! += vel[i]![d]!;
      }
      const fit = f(pos[i]!);
      if (fit < pFit[i]!) {
        pFit[i] = fit;
        pBest[i] = [...pos[i]!];
        if (fit < gFit) {
          gFit = fit;
          gBest = [...pos[i]!];
        }
      }
    }
    hooks.onIter?.(it, [...gBest], gFit);
  }
  hooks.onConclude?.(gBest, gFit);
  return { gBest, gFit };
}
