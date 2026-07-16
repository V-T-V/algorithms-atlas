// Extra Trees · 实现
export interface ETStump {
  feature: number;
  threshold: number;
  left: number;
  right: number;
}
function fitExtraStump(X: number[][], y: number[], seed: number): ETStump {
  const d = X[0]!.length;
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const f = Math.floor(rand() * d);
  const vals = X.map((r) => r[f]!);
  const mn = Math.min(...vals),
    mx = Math.max(...vals);
  const t = mn + rand() * (mx - mn);
  const left = y.filter((_, k) => X[k]![f]! <= t),
    right = y.filter((_, k) => X[k]![f]! > t);
  const ml = left.length ? Math.round(left.reduce((a, b) => a + b, 0) / left.length) : 0;
  const mr = right.length ? Math.round(right.reduce((a, b) => a + b, 0) / right.length) : 0;
  return { feature: f, threshold: t, left: ml, right: mr };
}
export interface ETModel {
  stumps: ETStump[];
}
export function extraTrees(X: number[][], y: number[], nTrees = 10): ETModel {
  const stumps: ETStump[] = [];
  for (let i = 0; i < nTrees; i++) stumps.push(fitExtraStump(X, y, i + 1));
  return { stumps };
}
export function predictExtra(model: ETModel, x: number[]): number {
  const votes: Record<number, number> = {};
  for (const s of model.stumps) {
    const p = x[s.feature]! <= s.threshold ? s.left : s.right;
    votes[p] = (votes[p] ?? 0) + 1;
  }
  let best = -1,
    max = -1;
  for (const c in votes)
    if (votes[c]! > max) {
      max = votes[c]!;
      best = Number(c);
    }
  return best;
}
