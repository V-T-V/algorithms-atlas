// 鲸鱼优化 · 实现
export interface WoHooks2 {
  onIter?: (i: number, best: number[], bestFit: number) => void;
  onConclude?: (best: number[], bestFit: number) => void;
}
export function whale(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 20,
  maxIter = 40,
  hooks: WoHooks2 = {},
): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const fit = pos.map((p) => f(p));
  let bi = fit.reduce((b, _, i) => (fit[i]! < fit[b]! ? i : b), 0);
  for (let it = 0; it < maxIter; it++) {
    const a = 2 - (2 * it) / maxIter;
    for (let i = 0; i < n; i++) {
      const A = 2 * a * Math.random() - a,
        C = 2 * Math.random(),
        p = Math.random();
      for (let d = 0; d < dim; d++) {
        if (p < 0.5) {
          if (Math.abs(A) < 1)
            pos[i]![d] = pos[bi]![d]! - A * Math.abs(C * pos[bi]![d]! - pos[i]![d]!);
          else {
            const rand = pos[Math.floor(Math.random() * n)]!;
            pos[i]![d] = rand[d]! - A * Math.abs(C * rand[d]! - pos[i]![d]!);
          }
        } else {
          const l = (Math.random() - 0.5) * 2;
          const D = Math.abs(pos[bi]![d]! - pos[i]![d]!);
          pos[i]![d] = D * Math.exp(0.5 * l) * Math.cos(2 * Math.PI * l) + pos[bi]![d]!;
        }
      }
      fit[i] = f(pos[i]!);
      if (fit[i]! < fit[bi]!) bi = i;
    }
    hooks.onIter?.(it, [...pos[bi]!], fit[bi]!);
  }
  hooks.onConclude?.([...pos[bi]!], fit[bi]!);
  return { best: [...pos[bi]!], bestFit: fit[bi]! };
}
