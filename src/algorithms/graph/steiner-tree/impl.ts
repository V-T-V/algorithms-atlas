// =============================================================================
// 斯坦纳树（Steiner Tree）· 纯算法实现
// Dreyfus-Wagner DP：O(3^k·n + 2^k·n²)，k=必经终点数。
//   dp[S][v] = 以 v 为根、连接终点子集 S 的最小子树代价。
//   转移 1（合并）：dp[S][v] = min_{T⊂S} dp[T][v]+dp[S\T][v]
//   转移 2（最短路松弛）：对每条边用类似 SPFA/三角松弛优化根。
// 答案 = min_v dp[full][v]。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
  undirected?: boolean;
}

export interface SteinerHooks {
  onInit?: (terminals: string[]) => void;
  onCombine?: (v: string, S: number, cost: number) => void;
  onRelax?: (v: string, S: number, cost: number) => void;
  onResult?: (treeEdges: Array<{ from: string; to: string; weight: number }>, cost: number) => void;
}

export interface SteinerResult {
  cost: number;
  edges: Array<{ from: string; to: string; weight: number }>;
}

/**
 * Dreyfus-Wagner Steiner 树。
 * @param input 图
 * @param terminals 必经终点（必须 ⊆ input.nodes）
 * @param hooks 可选事件钩子
 */
export function steinerTree(
  input: GraphInput,
  terminals: readonly string[],
  hooks: SteinerHooks = {},
): SteinerResult {
  const undirected = input.undirected ?? true;
  const { nodes } = input;
  const n = nodes.length;
  const idx = new Map<string, number>();
  nodes.forEach((v, i) => idx.set(v, i));

  // 去重终端并映射到下标
  const tUnique = [...new Set(terminals.filter((t) => idx.has(t)))];
  const k = tUnique.length;
  hooks.onInit?.(tUnique);
  if (k === 0) return { cost: 0, edges: [] };
  if (k === 1) return { cost: 0, edges: [] };

  const INF = Infinity;
  // 邻接矩阵
  const w: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(INF));
  for (let i = 0; i < n; i++) w[i]![i] = 0;
  for (const e of input.edges) {
    const a = idx.get(e.from);
    const b = idx.get(e.to);
    if (a === undefined || b === undefined) continue;
    const ww = e.weight ?? 1;
    if (ww < w[a]![b]!) w[a]![b] = ww;
    if (undirected && ww < w[b]![a]!) w[b]![a] = ww;
  }
  // 全对最短路（Floyd），用于根松弛
  const dist: number[][] = w.map((r) => [...r]);
  for (let m = 0; m < n; m++) {
    for (let i = 0; i < n; i++) {
      if (dist[i]![m] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (dist[m]![j] === INF) continue;
        const nd = dist[i]![m]! + dist[m]![j]!;
        if (nd < dist[i]![j]!) dist[i]![j] = nd;
      }
    }
  }

  // 终点子集编码：下标 i 的终端对应位 (1<<i)
  const full = (1 << k) - 1;
  // dp[mask][v]
  const dp: number[][] = Array.from({ length: 1 << k }, () => new Array<number>(n).fill(INF));
  // parent 记录（合并用）：parCombine[mask][v] = 子集 T（用于回溯）；parRoot[mask][v] = 最优根 u
  const parCombine: Int32Array[] = Array.from({ length: 1 << k }, () => new Int32Array(n).fill(-1));
  const parRoot: Int32Array[] = Array.from({ length: 1 << k }, () => new Int32Array(n).fill(-1));

  // 单终点初始化
  for (let i = 0; i < k; i++) {
    const v = idx.get(tUnique[i]!)!;
    dp[1 << i]![v] = 0;
  }

  // 枚举每个 mask，按 popcount 升序
  const masks: number[] = [];
  for (let m = 1; m <= full; m++) masks.push(m);
  masks.sort((a, b) => popcount(a) - popcount(b));

  for (const mask of masks) {
    // 转移 1：合并。枚举 mask 的真子集 T（不含 0、不含 mask）
    // 取 v 遍历，对每个 T 求 dp[T][v]+dp[mask^T][v]
    // 枚举子集标准技巧
    for (let v = 0; v < n; v++) {
      let best = dp[mask]![v]!;
      // 枚举 mask 的非空真子集
      for (let sub = (mask - 1) & mask; sub > 0; sub = (sub - 1) & mask) {
        const comp = mask ^ sub;
        if (sub > comp) continue; // 避免重复（只取 sub < comp 一侧）
        const sum = dp[sub]![v]! + dp[comp]![v]!;
        if (sum < best) {
          best = sum;
          parCombine[mask]![v] = sub;
        }
      }
      if (best < dp[mask]![v]!) {
        dp[mask]![v] = best;
        hooks.onCombine?.(nodes[v]!, mask, best);
      }
    }
    // 转移 2：根松弛——dp[mask][v] = min_u dp[mask][u] + dist[u][v]
    // 找最小 dp[mask][u]
    let bestU = -1;
    let bestVal = INF;
    for (let u = 0; u < n; u++) {
      if (dp[mask]![u]! < bestVal) {
        bestVal = dp[mask]![u]!;
        bestU = u;
      }
    }
    if (bestU >= 0) {
      for (let v = 0; v < n; v++) {
        const cand = bestVal + dist[bestU]![v]!;
        if (cand < dp[mask]![v]!) {
          dp[mask]![v] = cand;
          parRoot[mask]![v] = bestU;
          hooks.onRelax?.(nodes[v]!, mask, cand);
        }
      }
    }
  }

  // 答案：min_v dp[full][v]
  let bestV = -1;
  let bestCost = INF;
  for (let v = 0; v < n; v++) {
    if (dp[full]![v]! < bestCost) {
      bestCost = dp[full]![v]!;
      bestV = v;
    }
  }
  if (bestV < 0 || bestCost === INF) return { cost: INF, edges: [] };

  // 回溯：重建所选边。用 (mask, v) 状态递归收集「子树根 u 与对应 mask」，
  // 然后用最短路路径还原边。
  const treeEdges: Array<{ from: string; to: string; weight: number }> = [];
  const edgeSet = new Set<string>();
  const addEdge = (a: number, b: number): void => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    treeEdges.push({ from: nodes[a]!, to: nodes[b]!, weight: dist[a]![b]! });
  };
  // 预计算每对最短路的下一跳
  const nxt: Int32Array[] = Array.from({ length: n }, () => new Int32Array(n).fill(-1));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) if (i !== j && w[i]![j]! < INF) nxt[i]![j] = j;
  for (let m = 0; m < n; m++)
    for (let i = 0; i < n; i++) {
      if (nxt[i]![m] === -1) continue;
      for (let j = 0; j < n; j++) {
        if (nxt[m]![j] === -1) continue;
        if (dist[i]![m]! + dist[m]![j]! < dist[i]![j]!) {
          nxt[i]![j] = nxt[i]![m]!;
        }
      }
    }
  const pathEdges = (a: number, b: number): void => {
    if (a === b) return;
    let cur = a;
    while (cur !== b) {
      const nx = nxt[cur]![b]!;
      addEdge(cur, nx);
      cur = nx;
    }
  };

  const recurse = (mask: number, v: number): void => {
    if (popcount(mask) === 1) {
      // 单终端：若 v 不是该终端，连接最短路
      const t = Math.log2(mask) | 0;
      const tv = idx.get(tUnique[t]!)!;
      if (tv !== v) pathEdges(v, tv);
      return;
    }
    const comb = parCombine[mask]![v]!;
    if (comb !== -1) {
      recurse(comb, v);
      recurse(mask ^ comb, v);
      return;
    }
    const root = parRoot[mask]![v]!;
    if (root !== -1 && root !== v) {
      // v 由 root 松弛而来：root 上仍是同 mask
      pathEdges(root, v);
      recurse(mask, root);
      return;
    }
    // 无转移来源（可能是全 0 初始化的退化情形）
  };

  recurse(full, bestV);

  hooks.onResult?.(treeEdges, bestCost);
  return { cost: bestCost, edges: treeEdges };
}

function popcount(x: number): number {
  let c = 0;
  while (x) {
    x &= x - 1;
    c++;
  }
  return c;
}
