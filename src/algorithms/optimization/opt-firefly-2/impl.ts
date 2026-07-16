// 萤火虫算法 · 实现
export interface FaHooks {
  onIter?: (i: number, best: number[], bestFit: number) => void;
  onConclude?: (best: number[], bestFit: number) => void;
}
export function firefly(
  f: (x: readonly number[]) => number,
  dim: number,
  n = 15,
  maxIter = 30,
  hooks: FaHooks = {},
): { best: number[]; bestFit: number } {
  const pos = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (Math.random() - 0.5) * 10),
  );
  const alpha = 0.2,
    beta0 = 1,
    gamma = 1;
  for (let it = 0; it < maxIter; it++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (f(pos[j]!) < f(pos[i]!)) {
          const r = Math.sqrt(pos[i]!.reduce((a, v, d) => a + (v - pos[j]![d]!) ** 2, 0));
          const beta = beta0 * Math.exp(-gamma * r * r);
          for (let d = 0; d < dim; d++)
            pos[i]![d]! += beta * (pos[j]![d]! - pos[i]![d]!) + alpha * (Math.random() - 0.5);
        }
      }
    }
    const fits = pos.map((p) => f(p));
    const bi = fits.reduce((b, _, i) => (fits[i]! < fits[b]! ? i : b), 0);
    hooks.onIter?.(it, [...pos[bi]!], fits[bi]!);
  }
  const fits = pos.map((p) => f(p));
  const bi = fits.reduce((b, _, i) => (fits[i]! < fits[b]! ? i : b), 0);
  hooks.onConclude?.([...pos[bi]!], fits[bi]!);
  return { best: [...pos[bi]!], bestFit: fits[bi]! };
}
