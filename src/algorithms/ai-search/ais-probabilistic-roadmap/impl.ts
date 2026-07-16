export interface PrmHooks {
  onSample?: (id: number, x: number, y: number) => void;
  onEdge?: (a: number, b: number) => void;
  onPath?: (path: number[]) => void;
}
export interface PrmProblem {
  dim: [number, number];
  sample: () => [number, number];
  free: (a: [number, number], b: [number, number]) => boolean;
  start: [number, number];
  goal: [number, number];
  k: number;
}
export function probabilisticRoadmap(
  p: PrmProblem,
  nSamples: number,
  hooks: PrmHooks = {},
): number[] {
  const pts: Array<[number, number]> = [p.start, p.goal];
  pts[0] = p.start;
  pts[1] = p.goal;
  for (let i = 0; i < nSamples; i++) {
    const s = p.sample();
    pts.push(s);
    hooks.onSample?.(i + 2, s[0], s[1]);
  }
  const adj: Map<number, number[]> = new Map();
  for (let i = 0; i < pts.length; i++) {
    const cand = pts
      .map((_, j) => j)
      .filter((j) => j !== i)
      .map((j) => ({ j, d: dist(pts[i]!, pts[j]!) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, p.k);
    for (const c of cand) {
      if (p.free(pts[i]!, pts[c.j]!)) {
        hooks.onEdge?.(i, c.j);
        (adj.get(i) ?? adj.set(i, []).get(i)!).push(c.j);
        (adj.get(c.j) ?? adj.set(c.j, []).get(c.j)!).push(i);
      }
    }
  }
  // BFS 0->1
  const prev = new Map<number, number>([[0, -1]]);
  const q = [0];
  while (q.length) {
    const u = q.shift()!;
    if (u === 1) break;
    for (const v of adj.get(u) ?? [])
      if (!prev.has(v)) {
        prev.set(v, u);
        q.push(v);
      }
  }
  const path: number[] = [];
  let c: number | undefined = 1;
  while (c !== undefined && c !== -1) {
    path.unshift(c);
    c = prev.get(c);
  }
  hooks.onPath?.(path);
  return path;
}
function dist(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}
