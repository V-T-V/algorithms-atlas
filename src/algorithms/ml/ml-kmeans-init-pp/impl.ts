// K-Means++ 初始化 · 实现
export function kmeansPlusPlusInit(points: number[][], k: number, seed = 1): number[][] {
  const n = points.length;
  if (n === 0 || k <= 0) return [];
  let s = seed >>> 0;
  const rand = (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const centers: number[][] = [points[Math.floor(rand() * n)]!.slice()];
  while (centers.length < k && centers.length < n) {
    const dists = points.map((p) =>
      Math.min(...centers.map((c) => c.reduce((s, _, i) => s + (c[i]! - p[i]!) ** 2, 0))),
    );
    const total = dists.reduce((a, b) => a + b, 0);
    if (total === 0) {
      centers.push(points[centers.length]!.slice());
      continue;
    }
    let r = rand() * total,
      acc = 0;
    for (let i = 0; i < n; i++) {
      acc += dists[i]!;
      if (acc >= r) {
        centers.push(points[i]!.slice());
        break;
      }
    }
  }
  return centers;
}
