// 灰狼优化 · 实现
export interface GwoHooks {
  onIter?: (i: number, best: number[], bestFit: number) => void;
  onConclude?: (best: number[], bestFit: number) => void;
}
export function greyWolf(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 20,
  maxIter = 40,
  hooks: GwoHooks = {},
): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const fit = pos.map((p) => f(p));
  const sorted = () => [...fit.keys()].sort((a, b) => fit[a]! - fit[b]!);
  for (let it = 0; it < maxIter; it++) {
    const a = 2 - (2 * it) / maxIter;
    const order = sorted();
    const [alpha, beta, delta] = [pos[order[0]!]!, pos[order[1]!]!, pos[order[2]!]!];
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const upd = (lead: number[]) => {
          const A = 2 * a * Math.random() - a,
            C = 2 * Math.random();
          const D = Math.abs(C * lead[d]! - pos[i]![d]!);
          return lead[d]! - A * D;
        };
        pos[i]![d] = (upd(alpha) + upd(beta) + upd(delta)) / 3;
      }
      fit[i] = f(pos[i]!);
    }
    const o = sorted();
    hooks.onIter?.(it, [...pos[o[0]!]!], fit[o[0]!]!);
  }
  const o = sorted();
  hooks.onConclude?.([...pos[o[0]!]!], fit[o[0]!]!);
  return { best: [...pos[o[0]!]!], bestFit: fit[o[0]!]! };
}
