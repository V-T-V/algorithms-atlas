export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface EulerHooks {
  onDegree?: (v: string, deg: number) => void;
  onResult?: (kind: 'circuit' | 'path' | 'none') => void;
}
export function eulerKind(g: GraphInput, hooks: EulerHooks = {}): 'circuit' | 'path' | 'none' {
  const deg = new Map<string, number>();
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) {
    deg.set(n, 0);
    adj.set(n, []);
  }
  for (const e of g.edges) {
    deg.set(e.from, deg.get(e.from)! + 1);
    deg.set(e.to, deg.get(e.to)! + 1);
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  for (const [v, d] of deg) hooks.onDegree?.(v, d);
  // 连通性
  const visited = new Set<string>();
  const stack = [g.nodes[0] ?? ''];
  while (stack.length) {
    const u = stack.pop()!;
    if (visited.has(u)) continue;
    visited.add(u);
    for (const v of adj.get(u) ?? []) if (!visited.has(v)) stack.push(v);
  }
  for (const n of g.nodes)
    if (!visited.has(n) && deg.get(n)! > 0) {
      hooks.onResult?.('none');
      return 'none';
    }
  const odd = [...deg.values()].filter((d) => d % 2 === 1).length;
  const kind: 'circuit' | 'path' | 'none' = odd === 0 ? 'circuit' : odd === 2 ? 'path' : 'none';
  hooks.onResult?.(kind);
  return kind;
}
