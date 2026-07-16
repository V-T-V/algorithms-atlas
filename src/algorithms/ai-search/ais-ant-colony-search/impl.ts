// 蚁群算法 · 实现（小 TSP）
export interface AcoHooks {
  onIter?: (iter: number, bestLen: number, bestTour: number[]) => void;
  onImprove?: (bestLen: number, bestTour: number[]) => void;
  onDone?: (bestLen: number, bestTour: number[]) => void;
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
/** 距离矩阵 D[i][j]。 */
export function aco(
  D: number[][],
  ants: number,
  iters: number,
  alpha: number,
  beta: number,
  rho: number,
  seed = 13,
  hooks: AcoHooks = {},
): { bestLen: number; bestTour: number[] } {
  const n = D.length;
  const rng = makeRng(seed);
  const tau: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => 1));
  let bestLen = Infinity;
  let bestTour: number[] = [];
  for (let it = 0; it < iters; it++) {
    let iterBestLen = Infinity;
    let iterBestTour: number[] = [];
    for (let a = 0; a < ants; a++) {
      const start = Math.floor(rng() * n);
      const tour = [start];
      const visited = new Set([start]);
      let cur = start;
      while (tour.length < n) {
        const probs: number[] = [];
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (visited.has(j) || D[cur]![j]! <= 0) {
            probs.push(0);
            continue;
          }
          const p = Math.pow(tau[cur]![j]!, alpha) * Math.pow(1 / D[cur]![j]!, beta);
          probs.push(p);
          sum += p;
        }
        let r = rng() * sum;
        let next = -1;
        for (let j = 0; j < n; j++) {
          r -= probs[j]!;
          if (r <= 0 && probs[j]! > 0) {
            next = j;
            break;
          }
        }
        if (next < 0)
          for (let j = 0; j < n; j++)
            if (!visited.has(j)) {
              next = j;
              break;
            }
        tour.push(next!);
        visited.add(next!);
        cur = next!;
      }
      let len = 0;
      for (let i = 0; i < n; i++) len += D[tour[i]!]![tour[(i + 1) % n]!]!;
      if (len < iterBestLen) {
        iterBestLen = len;
        iterBestTour = [...tour];
      }
      if (len < bestLen) {
        bestLen = len;
        bestTour = [...tour];
        hooks.onImprove?.(bestLen, bestTour);
      }
    }
    // 信息素挥发 + 沉积（仅最佳蚂蚁）
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tau[i]![j]! *= 1 - rho;
    const L = iterBestLen;
    for (let i = 0; i < n; i++) {
      const a = iterBestTour[i]!;
      const b = iterBestTour[(i + 1) % n]!;
      tau[a]![b]! += 1 / L;
      tau[b]![a]! += 1 / L;
    }
    hooks.onIter?.(it, bestLen, bestTour);
  }
  hooks.onDone?.(bestLen, bestTour);
  return { bestLen, bestTour };
}
