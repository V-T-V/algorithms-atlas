// 拉斯维加斯匹配 · 实现（随机化增广路径）

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface LvHooks {
  onAugment?: (path: number[]) => void;
  onRetry?: (attempt: number) => void;
}

/** 随机化二分匹配：随机打乱左侧顶点顺序后贪心增广，重复直到无法改进。 */
export function lasVegasMatching(
  nLeft: number,
  nRight: number,
  edges: Array<[number, number]>,
  rng: Rng,
  hooks: LvHooks = {},
): Map<number, number> {
  const adj = new Map<number, number[]>();
  for (const [l, r] of edges) {
    if (!adj.has(l)) adj.set(l, []);
    adj.get(l)!.push(r);
  }
  const matchL = new Map<number, number>(); // l -> r
  const matchR = new Map<number, number>(); // r -> l

  const tryAugment = (l: number, visited: Set<number>): boolean => {
    const nbrs = adj.get(l) ?? [];
    // 随机打乱
    const order = [...nbrs].sort(() => rng() - 0.5);
    for (const r of order) {
      if (visited.has(r)) continue;
      visited.add(r);
      if (!matchR.has(r) || tryAugment(matchR.get(r)!, visited)) {
        matchL.set(l, r);
        matchR.set(r, l);
        return true;
      }
    }
    return false;
  };

  let attempt = 0;
  let improved = true;
  while (improved) {
    improved = false;
    attempt++;
    hooks.onRetry?.(attempt);
    const order = Array.from({ length: nLeft }, (_, i) => i).sort(() => rng() - 0.5);
    for (const l of order) {
      if (matchL.has(l)) continue;
      const visited = new Set<number>();
      if (tryAugment(l, visited)) {
        improved = true;
        hooks.onAugment?.([l, matchL.get(l)!]);
      }
    }
  }
  return matchL;
}
