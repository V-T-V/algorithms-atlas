// =============================================================================
// 三色 DFS
// =============================================================================

export type Color = 'WHITE' | 'GRAY' | 'BLACK';

export interface GraphInput3Dfs {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  directed?: boolean;
}

export interface DfsColorHooks {
  onEnter?: (node: string, parent: string | null) => void;
  onEdge?: (from: string, to: string, toColor: Color) => void;
  onExit?: (node: string) => void;
  onBackEdge?: (from: string, to: string) => void;
  onDone?: (order: string[], hasCycle: boolean) => void;
}

export interface DfsColorResult {
  order: string[];
  hasCycle: boolean;
}

export function buildAdj3Dfs(input: GraphInput3Dfs): Map<string, string[]> {
  const { nodes, edges, directed = false } = input;
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    if (!directed) adj.get(e.to)?.push(e.from);
  }
  for (const list of adj.values()) list.sort();
  return adj;
}

export function dfsColor(
  input: GraphInput3Dfs,
  start: string,
  hooks: DfsColorHooks = {},
): DfsColorResult {
  const adj = buildAdj3Dfs(input);
  const color = new Map<string, Color>();
  for (const n of input.nodes) color.set(n, 'WHITE');
  const order: string[] = [];
  let hasCycle = false;
  const directed = input.directed ?? false;

  const visit = (u: string, parent: string | null): void => {
    color.set(u, 'GRAY');
    order.push(u);
    hooks.onEnter?.(u, parent);
    for (const v of adj.get(u) ?? []) {
      if (directed && parent === v) continue;
      const cv = color.get(v) ?? 'WHITE';
      hooks.onEdge?.(u, v, cv);
      if (cv === 'WHITE') {
        visit(v, u);
      } else if (cv === 'GRAY' && !(directed && v === parent)) {
        hasCycle = true;
        hooks.onBackEdge?.(u, v);
      }
    }
    color.set(u, 'BLACK');
    hooks.onExit?.(u);
  };

  if (color.get(start) === 'WHITE') visit(start, null);
  hooks.onDone?.(order, hasCycle);
  return { order, hasCycle };
}
