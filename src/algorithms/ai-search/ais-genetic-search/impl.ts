// 遗传算法 · 实现
export interface GaHooks {
  onGeneration?: (gen: number, bestFit: number, avgFit: number) => void;
  onCrossover?: (p1: number[], p2: number[], child: number[]) => void;
  onMutate?: (ind: number[], idx: number) => void;
  onDone?: (best: number[], fit: number) => void;
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function fitness(ind: number[]): number {
  return ind.reduce((a, b) => a + b, 0);
}
export function geneticAlgorithm(
  n: number,
  popSize: number,
  generations: number,
  pm: number,
  seed = 7,
  hooks: GaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  let pop: number[][] = Array.from({ length: popSize }, () =>
    Array.from({ length: n }, () => (rng() < 0.5 ? 0 : 1)),
  );
  const sorted = () => [...pop].sort((a, b) => fitness(b) - fitness(a));
  let best = sorted()[0]!;
  for (let g = 0; g < generations; g++) {
    const ranked = sorted();
    const total = ranked.reduce((s, ind) => s + fitness(ind), 0);
    const avg = total / ranked.length;
    hooks.onGeneration?.(g, fitness(ranked[0]!), avg);
    if (fitness(ranked[0]!) > fitness(best)) best = ranked[0]!;
    // 选择（前一半作为父代池）
    const pool = ranked.slice(0, Math.max(2, Math.floor(popSize / 2)));
    const next: number[][] = [];
    while (next.length < popSize) {
      const p1 = pool[Math.floor(rng() * pool.length)]!;
      const p2 = pool[Math.floor(rng() * pool.length)]!;
      const cut = 1 + Math.floor(rng() * (n - 1));
      const child = [...p1.slice(0, cut), ...p2.slice(cut)];
      hooks.onCrossover?.(p1, p2, child);
      for (let i = 0; i < n; i++) {
        if (rng() < pm) {
          child[i] = child[i]! ? 0 : 1;
          hooks.onMutate?.(child, i);
        }
      }
      next.push(child);
    }
    pop = next;
  }
  const final = sorted()[0]!;
  if (fitness(final) > fitness(best)) best = final;
  hooks.onDone?.(best, fitness(best));
  return { best, fit: fitness(best) };
}
