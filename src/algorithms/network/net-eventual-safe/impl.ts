export interface SafeHooks {
  onSafe?: (v: number) => void;
  onResult?: (nodes: number[]) => void;
}
export function eventualSafeNodes(graph: number[][], hooks: SafeHooks = {}): number[] {
  const n = graph.length;
  const radj: Set<number>[] = Array.from({ length: n }, () => new Set());
  const outdeg = new Array(n).fill(0);
  for (let u = 0; u < n; u++) {
    outdeg[u] = graph[u]!.length;
    for (const v of graph[u]!) radj[v]!.add(u);
  }
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (outdeg[i] === 0) q.push(i);
  const safe = new Array(n).fill(false);
  while (q.length) {
    const u = q.shift()!;
    safe[u] = true;
    hooks.onSafe?.(u);
    for (const prev of radj[u]!) {
      outdeg[prev]!--;
      if (outdeg[prev] === 0) q.push(prev);
    }
  }
  const res = safe.map((s, i) => (s ? i : -1)).filter((i) => i >= 0);
  hooks.onResult?.(res);
  return res;
}
