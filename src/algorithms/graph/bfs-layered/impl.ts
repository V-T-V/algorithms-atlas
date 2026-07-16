// =============================================================================
// 分层 BFS（Layered BFS）· 纯算法实现
// 从源点出发按层扩散，记录每个顶点所在的层数与每一层的成员。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
  undirected?: boolean;
}

export interface BfsLayeredHooks {
  onVisit?: (v: string, layer: number) => void;
  onLayer?: (layer: number, members: string[]) => void;
  onResult?: (layers: string[][], dist: Map<string, number>) => void;
}

export interface BfsLayeredResult {
  layers: string[][];
  dist: Map<string, number>;
}

export function bfsLayered(
  input: GraphInput,
  source: string,
  hooks: BfsLayeredHooks = {},
): BfsLayeredResult {
  const undirected = input.undirected ?? true;
  const { nodes, edges } = input;
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.push(e.to);
    if (undirected) adj.get(e.to)!.push(e.from);
  }
  for (const list of adj.values()) list.sort();

  const dist = new Map<string, number>();
  const layers: string[][] = [];
  if (!adj.has(source)) return { layers, dist };

  dist.set(source, 0);
  let frontier: string[] = [source];
  layers.push(frontier);
  hooks.onVisit?.(source, 0);
  hooks.onLayer?.(0, frontier);

  let layer = 0;
  while (frontier.length > 0) {
    layer++;
    const next: string[] = [];
    for (const u of frontier) {
      for (const v of adj.get(u) ?? []) {
        if (!dist.has(v)) {
          dist.set(v, layer);
          next.push(v);
          hooks.onVisit?.(v, layer);
        }
      }
    }
    if (next.length > 0) {
      layers.push(next);
      hooks.onLayer?.(layer, next);
    }
    frontier = next;
  }

  hooks.onResult?.(layers, dist);
  return { layers, dist };
}
