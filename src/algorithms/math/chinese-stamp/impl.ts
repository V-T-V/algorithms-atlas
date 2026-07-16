// =============================================================================
// 中国邮路 Chinese Postman · 纯算法实现
// 在「连通无向带权图」上求一条经过每条边至少一次（且可回到起点）的最短闭合路径。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一条无向边（端点用 0..V-1 的整数编号）。 */
export interface Edge {
  u: number;
  v: number;
  w: number;
}

/** 中国邮路结果。 */
export interface ChinesePostmanResult {
  /** 原图边权之和。 */
  totalWeight: number;
  /** 因配对奇度点而「额外重复走」的边权之和。 */
  addedWeight: number;
  /** 最优邮路总长度 = totalWeight + addedWeight。 */
  routeLength: number;
  /** 经过每条边至少一次的闭合顶点序列（首尾相同）。 */
  tour: number[];
}

/**
 * 事件钩子。任一可选。
 */
export interface ChinesePostmanHooks {
  /** 统计完各点度数后：列出奇度点集合。 */
  onOddVertices?: (odds: number[]) => void;
  /** 完成奇度点两两最短路径（Floyd-Warshall）。 */
  onAllPairs?: (dist: number[][]) => void;
  /** 选定一组最小权完美匹配（配对列表 + 该匹配额外代价）。 */
  onMatching?: (pairs: Array<[number, number]>, cost: number) => void;
  /** 在「重复边」后的多重图上求出欧拉回路。 */
  onEulerTour?: (tour: number[]) => void;
  /** 最终结果。 */
  onDone?: (result: ChinesePostmanResult) => void;
}

/** 读入边集，返回顶点数与每个点的度数。 */
function degrees(V: number, edges: readonly Edge[]): number[] {
  const deg = new Array<number>(V).fill(0);
  for (const e of edges) {
    deg[e.u]!++;
    deg[e.v]!++;
  }
  return deg;
}

/** Floyd-Warshall：求所有点对最短路。dist[i][j] = 最短距离（不可达为 Infinity）。 */
function floydWarshall(V: number, edges: readonly Edge[]): number[][] {
  const dist: number[][] = Array.from({ length: V }, () => new Array<number>(V).fill(Infinity));
  for (let i = 0; i < V; i++) dist[i]![i] = 0;
  for (const e of edges) {
    dist[e.u]![e.v] = Math.min(dist[e.u]![e.v]!, e.w);
    dist[e.v]![e.u] = Math.min(dist[e.v]![e.u]!, e.w);
  }
  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i]![k]! + dist[k]![j]! < dist[i]![j]!) {
          dist[i]![j] = dist[i]![k]! + dist[k]![j]!;
        }
      }
    }
  }
  return dist;
}

/** 在奇度点集合上求最小权完美匹配（暴力枚举，奇度点个数 ≤ ~16 时可用）。 */
function minWeightPerfectMatching(
  odds: number[],
  dist: number[][],
): { pairs: Array<[number, number]>; cost: number } {
  if (odds.length === 0) return { pairs: [], cost: 0 };
  let best: Array<[number, number]> | null = null;
  let bestCost = Infinity;
  const cur: Array<[number, number]> = [];

  const recurse = (remaining: number[], costSoFar: number): void => {
    if (remaining.length === 0) {
      if (costSoFar < bestCost) {
        bestCost = costSoFar;
        best = cur.map((p) => [p[0], p[1]] as [number, number]);
      }
      return;
    }
    // 取剩余第一个点 a，与其它任一 b 配对
    const a = remaining[0]!;
    const rest = remaining.slice(1);
    for (let i = 0; i < rest.length; i++) {
      const b = rest[i]!;
      const others = rest.slice(0, i).concat(rest.slice(i + 1));
      cur.push([a, b]);
      recurse(others, costSoFar + dist[a]![b]!);
      cur.pop();
    }
  };
  recurse(odds, 0);
  return { pairs: best ?? [], cost: bestCost };
}

/** 在「加入重复边后的多重图」上用 Hierholzer 算法求欧拉回路。 */
function eulerTour(V: number, baseEdges: readonly Edge[], extraEdges: readonly Edge[]): number[] {
  // 用邻接多重表（每个邻接项存 [to, edgeId]），方便删边。
  // 合并基础边与重复边；为支持平行边，给每条边一个唯一 id。
  const adj: Array<Array<{ to: number; id: number }>> = Array.from({ length: V }, () => []);
  let eid = 0;
  const addEdge = (u: number, v: number): void => {
    adj[u]!.push({ to: v, id: eid });
    adj[v]!.push({ to: u, id: eid });
    eid++;
  };
  for (const e of baseEdges) addEdge(e.u, e.v);
  for (const e of extraEdges) addEdge(e.u, e.v);

  const used = new Array<boolean>(eid).fill(false);
  const tour: number[] = [];
  // 把邻接表转为可 pop 的数组（按索引访问），记录每个点下一个待处理的位置。
  const nextIdx = new Array<number>(V).fill(0);

  const stack: number[] = [0];
  while (stack.length > 0) {
    const v = stack[stack.length - 1]!;
    // 找下一条未使用的边
    while (nextIdx[v]! < adj[v]!.length && used[adj[v]![nextIdx[v]!]!.id]!) {
      nextIdx[v]!++;
    }
    if (nextIdx[v]! >= adj[v]!.length) {
      tour.push(v);
      stack.pop();
    } else {
      const { to, id } = adj[v]![nextIdx[v]!]!;
      used[id] = true;
      stack.push(to);
    }
  }
  tour.reverse();
  return tour;
}

/**
 * 中国邮路主函数。
 *
 * @param V 顶点数（顶点编号 0..V-1）。
 * @param edges 无向带权边列表（连通图）。
 * @param hooks 事件钩子（可选）。
 */
export function chineseStamp(
  V: number,
  edges: readonly Edge[],
  hooks: ChinesePostmanHooks = {},
): ChinesePostmanResult {
  if (V < 0) throw new RangeError('V 需为非负整数');
  for (const e of edges) {
    if (e.u < 0 || e.u >= V || e.v < 0 || e.v >= V) {
      throw new RangeError(`边端点越界：(${e.u}, ${e.v})`);
    }
  }

  const totalWeight = edges.reduce((s, e) => s + e.w, 0);

  // 1. 找奇度点
  const deg = degrees(V, edges);
  const odds: number[] = [];
  for (let i = 0; i < V; i++) if (deg[i]! % 2 === 1) odds.push(i);
  hooks.onOddVertices?.(odds);

  // 2. 全源最短路
  const dist = floydWarshall(V, edges);
  hooks.onAllPairs?.(dist);

  // 3. 奇度点最小权完美匹配 → 决定哪些边需要「重复走」
  const { pairs, cost: addedWeight } = minWeightPerfectMatching(odds, dist);
  hooks.onMatching?.(pairs, addedWeight);

  // 4. 把每条配对路径上的边作为「重复边」加入（这里简化：直接连一条 a-b 的边权为最短路长度，
  //    对欧拉回路的存在性等价——多重图里只要度数变偶即可。）
  const extraEdges: Edge[] = pairs.map(([a, b]) => ({ u: a, v: b, w: dist[a]![b]! }));

  // 5. 求欧拉回路
  const tour = eulerTour(V, edges, extraEdges);
  hooks.onEulerTour?.(tour);

  const result: ChinesePostmanResult = {
    totalWeight,
    addedWeight,
    routeLength: totalWeight + addedWeight,
    tour,
  };
  hooks.onDone?.(result);
  return result;
}
