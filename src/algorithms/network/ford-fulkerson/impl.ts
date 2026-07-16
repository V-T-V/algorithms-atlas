// =============================================================================
// 最大流 Ford-Fulkerson（BFS 增广路 / Edmonds-Karp 变体）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 流网络输入：有向图 + 容量。 */
export interface FlowNetworkInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  /** 源点。 */
  source: string;
  /** 汇点。 */
  sink: string;
}

/** 单条边的流量信息（结果）。from→to 的当前净流量（>=0），以及容量。 */
export interface FlowEdgeResult {
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

/** 最大流结果。 */
export interface MaxFlowResult {
  /** 最大流值。 */
  maxFlow: number;
  /** 每条原图边上的流量（仅 flow>0 者有意义；含反向边的净额）。 */
  flows: FlowEdgeResult[];
}

/** Ford-Fulkerson 执行过程中的事件钩子。任一可选。 */
export interface FordFulkersonHooks {
  /** 找到一条增广路 path（节点序列），瓶颈容量 bottleneck。 */
  onAugment?: (path: string[], bottleneck: number, totalFlow: number) => void;
  /** 某轮未找到增广路，算法结束。 */
  onNoPath?: (totalFlow: number) => void;
}

/** 残量图：邻接表 from → {to, cap, revIndex（在 to 的邻接表中对应反向边的下标）}。 */
interface ResArc {
  to: string;
  cap: number;
  rev: number; // 反向边在 to 的邻接表中的下标
}

/** 路径上一跳：节点 u 经其邻接表的第 arcIdx 条边到达。 */
interface PathHop {
  node: string;
  arcIdx: number;
}

/** 用 BFS 在残量图上找一条 s→t 增广路，返回路径节点序列、逐跳弧下标与瓶颈。 */
function bfsAugmentingPath(
  graph: Map<string, ResArc[]>,
  source: string,
  sink: string,
): { path: string[]; hops: PathHop[]; bottleneck: number } | null {
  const prev = new Map<string, PathHop>(); // to -> 来自哪一跳
  const seen = new Set<string>([source]);
  const queue: string[] = [source];
  while (queue.length > 0) {
    const u = queue.shift()!;
    if (u === sink) break;
    const arcs = graph.get(u) ?? [];
    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i]!;
      if (a.cap > 0 && !seen.has(a.to)) {
        seen.add(a.to);
        prev.set(a.to, { node: u, arcIdx: i });
        queue.push(a.to);
      }
    }
  }
  if (source !== sink && !prev.has(sink)) return null;

  // 回溯路径与瓶颈
  const path: string[] = [sink];
  const hops: PathHop[] = [];
  let bottleneck = Infinity;
  let cur: string = sink;
  while (cur !== source) {
    const p = prev.get(cur);
    if (!p) return null;
    hops.push(p);
    const arc = graph.get(p.node)![p.arcIdx]!;
    if (arc.cap < bottleneck) bottleneck = arc.cap;
    path.push(p.node);
    cur = p.node;
  }
  path.reverse();
  hops.reverse();
  if (!Number.isFinite(bottleneck)) return null;
  return { path, hops, bottleneck };
}

/**
 * Ford-Fulkerson 方法（BFS 寻路 = Edmonds-Karp），求 source→sink 最大流。
 *
 * @param input 流网络
 * @param hooks 可选事件钩子
 * @returns 最大流值与各边流量
 */
export function fordFulkerson(
  input: FlowNetworkInput,
  hooks: FordFulkersonHooks = {},
): MaxFlowResult {
  const { nodes, edges, source, sink } = input;

  // 构建残量图（每条原图边 + 一条容量 0 的反向边）
  const graph = new Map<string, ResArc[]>();
  for (const n of nodes) graph.set(n, []);
  // 记录原图边以便输出流量
  const originalEdges: Array<{ from: string; to: string; capacity: number }> = [];

  for (const e of edges) {
    const fromList = graph.get(e.from);
    const toList = graph.get(e.to);
    if (!fromList || !toList) continue;
    const revFrom = fromList.length;
    const revTo = toList.length;
    fromList.push({ to: e.to, cap: e.capacity, rev: revTo });
    toList.push({ to: e.from, cap: 0, rev: revFrom });
    originalEdges.push({ from: e.from, to: e.to, capacity: e.capacity });
  }

  let maxFlow = 0;

  // 反复找增广路
  for (;;) {
    const found = bfsAugmentingPath(graph, source, sink);
    if (!found) {
      hooks.onNoPath?.(maxFlow);
      break;
    }
    const { path, hops, bottleneck } = found;
    // 沿路径推进 bottleneck 流量（更新正/反向边残量），用记录好的弧下标
    for (const hop of hops) {
      const arc = graph.get(hop.node)![hop.arcIdx]!;
      arc.cap -= bottleneck;
      const revArc = graph.get(arc.to)![arc.rev]!;
      revArc.cap += bottleneck;
    }
    maxFlow += bottleneck;
    hooks.onAugment?.(path, bottleneck, maxFlow);
  }

  // 计算每条原图边的净流量 flow = capacity - 正向残量
  const flows: FlowEdgeResult[] = [];
  for (const e of originalEdges) {
    const arcs = graph.get(e.from)!;
    // 原图正向边：在 from 的邻接表中 to==e.to；取残量（平行边取首条，由构建顺序保证）
    const arc = arcs.find((a) => a.to === e.to);
    const resid = arc ? arc.cap : e.capacity;
    flows.push({ from: e.from, to: e.to, capacity: e.capacity, flow: e.capacity - resid });
  }

  return { maxFlow, flows };
}
