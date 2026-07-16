// 锦标赛选择 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface TourHooks {
  onDraw?: (indices: number[]) => void;
  onWinner?: (index: number, fitness: number) => void;
}

/** 从 fitness 数组抽 k 个，返回最优者索引（最大化适应度）。 */
export function tournamentSelect(
  fitness: number[],
  k: number,
  rng: Rng,
  hooks: TourHooks = {},
): number {
  if (k > fitness.length) throw new RangeError(`k=${k} > n=${fitness.length}`);
  const indices = new Set<number>();
  while (indices.size < k) {
    indices.add(Math.floor(rng() * fitness.length));
  }
  const arr = [...indices];
  hooks.onDraw?.(arr);
  let best = arr[0]!;
  for (const idx of arr) {
    if (fitness[idx]! > fitness[best]!) best = idx;
  }
  hooks.onWinner?.(best, fitness[best]!);
  return best;
}

/** 多次锦标赛选择，返回 winners 索引数组。 */
export function tournamentSelectMany(
  fitness: number[],
  k: number,
  count: number,
  rng: Rng,
): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(tournamentSelect(fitness, k, rng));
  return out;
}
