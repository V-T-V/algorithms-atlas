// =============================================================================
// 全源最短路（带路径重建，Floyd-Warshall）· 纯算法实现
// 注意：本算法 id 名为 all-pairs-shortest-johnson，但实现采用 Floyd-Warshall + 路径重建，
//   与已有 johnson（不加路径）区分，重点是「任意两点对的最短路径序列」。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  undirected?: boolean;
}

export interface ApshHooks {
  onInit?: (dist: number[][]) => void;
  onRelax?: (k: number, i: number, j: number, newDist: number) => void;
  onResult?: (dist: number[][], hasNegativeCycle: boolean) => void;
}

export interface ApshResult {
  dist: number[][];
  next: (number | null)[][];
  hasNegativeCycle: boolean;
  nodes: string[];
}

export function allPairsShortestPath(input: GraphInput, hooks: ApshHooks = {}): ApshResult {
  const undirected = input.undirected ?? true;
  const { nodes } = input;
  const n = nodes.length;
  const idx = new Map<string, number>();
  nodes.forEach((v, i) => idx.set(v, i));

  const INF = Infinity;
  const dist: number[][] = Array.from({ length: n }, (_, i) => {
    const row = new Array<number>(n).fill(INF);
    row[i] = 0;
    return row;
  });
  const next: (number | null)[][] = Array.from({ length: n }, () =>
    new Array<number | null>(n).fill(null),
  );

  for (const e of input.edges) {
    const a = idx.get(e.from);
    const b = idx.get(e.to);
    if (a === undefined || b === undefined) continue;
    const ww = e.weight ?? 1;
    if (ww < dist[a]![b]!) {
      dist[a]![b] = ww;
      next[a]![b] = b;
    }
    if (undirected && ww < dist[b]![a]!) {
      dist[b]![a] = ww;
      next[b]![a] = a;
    }
  }
  hooks.onInit?.(dist.map((r) => [...r]));

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i]![k] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k]![j] === INF) continue;
        const nd = dist[i]![k]! + dist[k]![j]!;
        if (nd < dist[i]![j]!) {
          dist[i]![j] = nd;
          next[i]![j] = next[i]![k] ?? null;
          hooks.onRelax?.(k, i, j, nd);
        }
      }
    }
  }

  // 负环检测
  let hasNegativeCycle = false;
  for (let i = 0; i < n; i++) {
    if (dist[i]![i]! < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  hooks.onResult?.(
    dist.map((r) => [...r]),
    hasNegativeCycle,
  );
  return { dist, next, hasNegativeCycle, nodes: [...nodes] };
}

/** 从 next 表重建 i→j 的路径（节点 id 序列），不可达返回 null。 */
export function reconstructPath(
  next: (number | null)[][],
  nodes: readonly string[],
  i: number,
  j: number,
): string[] | null {
  if (next[i]![j] === null) {
    return i === j ? [nodes[i]!] : null;
  }
  const path: string[] = [nodes[i]!];
  let cur = i;
  while (cur !== j) {
    const nx = next[cur]![j];
    if (nx === null) return null;
    cur = nx!;
    path.push(nodes[cur]!);
  }
  return path;
}
