// =============================================================================
// 二分匹配变种（Hopcroft-Karp）· 纯算法实现
// 左侧 L (0..nL-1)，右侧 R (0..nR-1)；邻接表 adj[u] = v 列表。
// =============================================================================
export interface HopcroftKarpHooks {
  onPhase?: (phase: number, distINF: number) => void;
  onAugment?: (path: Array<{ u: number; v: number }>, total: number) => void;
  onResult?: (matching: Array<{ u: number; v: number }>, size: number) => void;
}

export interface BipartiteInput {
  nL: number;
  nR: number;
  /** 左侧 u -> 右侧 v 的边。 */
  edges: Array<{ u: number; v: number }>;
}

export function hopcroftKarp(
  input: BipartiteInput,
  hooks: HopcroftKarpHooks = {},
): Array<{ u: number; v: number }> {
  const { nL, nR } = input;
  const adj: number[][] = Array.from({ length: nL }, () => []);
  for (const e of input.edges) adj[e.u]!.push(e.v);

  const pairU = new Array<number>(nL).fill(-1);
  const pairV = new Array<number>(nR).fill(-1);
  const dist = new Array<number>(nL).fill(0);
  const INF = 1 << 30;

  const bfs = (): boolean => {
    const queue: number[] = [];
    for (let u = 0; u < nL; u++) {
      if (pairU[u] === -1) {
        dist[u] = 0;
        queue.push(u);
      } else dist[u] = INF;
    }
    let found = false;
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++]!;
      for (const v of adj[u]!) {
        const w = pairV[v]!;
        if (w === -1) found = true;
        else if (dist[w]! === INF) {
          dist[w] = dist[u]! + 1;
          queue.push(w);
        }
      }
    }
    return found;
  };

  const dfs = (u: number): boolean => {
    for (const v of adj[u]!) {
      const w = pairV[v]!;
      if (w === -1 || (dist[w]! === dist[u]! + 1 && dfs(w))) {
        pairU[u] = v;
        pairV[v] = u;
        return true;
      }
    }
    dist[u] = INF;
    return false;
  };

  let total = 0;
  let phase = 0;
  while (bfs()) {
    phase++;
    hooks.onPhase?.(phase, INF);
    for (let u = 0; u < nL; u++) {
      if (pairU[u] === -1 && dfs(u)) {
        total++;
        const path: Array<{ u: number; v: number }> = [];
        // 还原本次增广：从 u 沿 pairU 走一步即可
        path.push({ u, v: pairU[u]! });
        hooks.onAugment?.(path, total);
      }
    }
  }
  const matching: Array<{ u: number; v: number }> = [];
  for (let u = 0; u < nL; u++) if (pairU[u] !== -1) matching.push({ u, v: pairU[u]! });
  hooks.onResult?.(matching, total);
  return matching;
}
