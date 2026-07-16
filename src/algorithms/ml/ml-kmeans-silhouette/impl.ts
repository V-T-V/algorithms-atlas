// 轮廓系数 · 实现
export interface SilResult {
  score: number;
  perSample: number[];
}
export function silhouette(points: number[][], labels: number[]): SilResult {
  const n = points.length;
  if (n === 0) return { score: 0, perSample: [] };
  const perSample: number[] = new Array(n).fill(0);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const li = labels[i]!;
    let aSum = 0,
      aCnt = 0;
    const bSum: Record<number, { s: number; c: number }> = {};
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = Math.hypot(...points[i]!.map((v, k) => v - points[j]![k]!));
      if (labels[j] === li) {
        aSum += d;
        aCnt++;
      } else {
        const k = labels[j]!;
        if (!bSum[k]) bSum[k] = { s: 0, c: 0 };
        bSum[k]!.s += d;
        bSum[k]!.c++;
      }
    }
    const a = aCnt > 0 ? aSum / aCnt : 0;
    let b = Infinity;
    for (const k in bSum) b = Math.min(b, bSum[k]!.s / bSum[k]!.c);
    const s = aCnt > 0 && b !== Infinity ? (b - a) / Math.max(a, b) : 0;
    perSample[i] = s;
    total += s;
  }
  return { score: total / n, perSample };
}
