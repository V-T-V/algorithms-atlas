export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight?: number }>;
}
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  return adj;
}
export interface CCHooks {
  onComponent?: (members: string[]) => void;
  onResult?: (n: number) => void;
}
export function connectedComponents(g: GraphInput, hooks: CCHooks = {}): string[][] {
  const adj = buildAdj(g);
  const visited = new Set<string>();
  const comps: string[][] = [];
  for (const start of g.nodes) {
    if (visited.has(start)) continue;
    const comp: string[] = [];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const u = stack.pop()!;
      comp.push(u);
      for (const v of adj.get(u) ?? [])
        if (!visited.has(v)) {
          visited.add(v);
          stack.push(v);
        }
    }
    comps.push(comp);
    hooks.onComponent?.(comp);
  }
  hooks.onResult?.(comps.length);
  return comps;
}
