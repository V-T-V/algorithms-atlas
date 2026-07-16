// =============================================================================
// Dinic 最大流 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：BFS 构造层次图（level graph），DFS 在层次图上找增广路并推流；
//       反复执行直到 BFS 无法到达汇点。多路增广 + 当前弧优化。
// =============================================================================

/** 容量网络输入（有向）。 */
export interface FlowNetworkInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sink: string;
}

/** Dinic 执行过程中的事件钩子。任一可选。 */
export interface DinicHooks {
  /** 开始新一轮 BFS 分层。若返回 false 表示无法到达 sink，算法终止。 */
  onBfsStart?: (phase: number, reachable: boolean) => void;
  /** 访问一条边完成层次赋值（level[to] = level[from]+1）。 */
  onBfsEdge?: (from: string, to: string, levelTo: number) => void;
  /** 本轮 BFS 结束，给出各节点 level（不可达记 -1）。 */
  onBfsDone?: (levels: Map<string, number>) => void;
  /** DFS 增广成功一条 s→t 路径，推送 flow 流量；path 为节点序列。 */
  onAugment?: (path: string[], flow: number) => void;
  /** 推送了一段 (u,v) 流量（u→v），用于绘制残量变化。pushed 为本次推送量。 */
  onPush?: (u: string, v: string, pushed: number, residual: number) => void;
  /** 算法完成：最大流值。 */
  onDone?: (maxFlow: number) => void;
}

/** 最大流结果。 */
export interface MaxFlowResult {
  maxFlow: number;
  /** 每条边的最终流量（key = "from>to"，对应输入边的顺序）。 */
  flows: Map<string, number>;
}

/** 内部边结构（成对存储以支持反边）。 */
interface FlowEdge {
  to: string;
  /** 残余容量。 */
  cap: number;
  /** 反向边在邻接表中的下标。 */
  rev: number;
  /** 原始容量（仅用于回填 flows，正边记录原始值，反边为 0）。 */
  orig: number;
  /** 是否为正向边（用于回填 flows）。 */
  forward: boolean;
  /** 对应的输入边标识（仅正边有）。 */
  key: string;
}

/**
 * Dinic 最大流。
 *
 * @param input 容量网络（有向）
 * @param hooks 可选事件钩子
 * @returns 最大流值与每条输入边的实际流量
 */
export function dinic(input: FlowNetworkInput, hooks: DinicHooks = {}): MaxFlowResult {
  const { nodes, edges, source, sink } = input;
  if (source === sink) return { maxFlow: 0, flows: new Map() };

  // 邻接表
  const graph = new Map<string, FlowEdge[]>();
  for (const n of nodes) graph.set(n, []);
  // 边 key → 输入边索引（用于回填）
  const keyToFlow = new Map<string, number>();

  const addEdge = (from: string, to: string, cap: number, key: string): void => {
    if (!graph.has(from) || !graph.has(to)) return;
    const fwd: FlowEdge = { to, cap, rev: 0, orig: cap, forward: true, key };
    const rev: FlowEdge = { to: from, cap: 0, rev: 0, orig: 0, forward: false, key };
    fwd.rev = graph.get(to)!.length;
    rev.rev = graph.get(from)!.length;
    graph.get(from)!.push(fwd);
    graph.get(to)!.push(rev);
  };

  for (const e of edges) {
    const key = `${e.from}>${e.to}`;
    addEdge(e.from, e.to, e.capacity, key);
    keyToFlow.set(key, 0);
  }

  const level = new Map<string, number>();

  // BFS 分层：能否从 source 到 sink。返回 sink 是否可达。
  const bfs = (phase: number): boolean => {
    for (const n of nodes) level.set(n, -1);
    level.set(source, 0);
    let reachable = source === sink;
    const queue: string[] = [source];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      const lu = level.get(u)!;
      for (const e of graph.get(u) ?? []) {
        if (e.cap > 0 && level.get(e.to) === -1) {
          level.set(e.to, lu + 1);
          hooks.onBfsEdge?.(u, e.to, lu + 1);
          queue.push(e.to);
          if (e.to === sink) reachable = true;
        }
      }
    }
    hooks.onBfsDone?.(new Map(level));
    hooks.onBfsStart?.(phase, reachable);
    return reachable && level.get(sink) !== -1;
  };

  // 当前弧指针
  const iter = new Map<string, number>();
  for (const n of nodes) iter.set(n, 0);

  // DFS 多路增广：从 u 推 flow 到 sink，返回实际推送量。
  const dfs = (u: string, pushedIn: number): number => {
    if (u === sink) return pushedIn;
    const lu = level.get(u)!;
    let pushed = 0;
    const adj = graph.get(u)!;
    while (iter.get(u)! < adj.length) {
      const ei = iter.get(u)!;
      const e = adj[ei]!;
      if (e.cap > 0 && level.get(e.to) === lu + 1) {
        const d = Math.min(pushedIn - pushed, e.cap);
        const got = dfs(e.to, d);
        if (got > 0) {
          // 更新残余容量
          e.cap -= got;
          graph.get(e.to)![e.rev]!.cap += got;
          pushed += got;
          hooks.onPush?.(u, e.to, got, e.cap);
          if (pushed === pushedIn) break;
        }
      }
      iter.set(u, ei + 1);
    }
    return pushed;
  };

  // 记录增广路径（重建）：每次 DFS 成功后，沿 level 升序 + 残量变化回溯一条路径
  // 为简化钩子，我们用 onPush 时记录残量图，DFS 完成后由调用方重建路径。
  // 这里给出一个「按层次回溯」的轻量路径重建。
  const reconstructPath = (): string[] => {
    const path = [source];
    let cur: string = source;
    let guard = 0;
    while (cur !== sink && guard <= nodes.length) {
      guard++;
      const lu = level.get(cur)!;
      let advanced = false;
      for (const e of graph.get(cur) ?? []) {
        // 走「在本轮被增广过的正向边」：cap 减小且 level 递增
        if (e.forward && e.cap < e.orig && level.get(e.to) === lu + 1) {
          path.push(e.to);
          cur = e.to;
          advanced = true;
          break;
        }
      }
      if (!advanced) break;
    }
    return path;
  };

  let maxFlow = 0;
  let phase = 0;
  while (bfs(phase)) {
    phase++;
    for (const n of nodes) iter.set(n, 0);
    let f = dfs(source, Infinity);
    while (f > 0) {
      maxFlow += f;
      const path = reconstructPath();
      hooks.onAugment?.(path, f);
      f = dfs(source, Infinity);
    }
  }

  // 回填每条输入边的流量 = 原始容量 - 当前残余
  const flows = new Map<string, number>();
  for (const n of nodes) {
    for (const e of graph.get(n) ?? []) {
      if (e.forward) flows.set(e.key, e.orig - e.cap);
    }
  }
  hooks.onDone?.(maxFlow);
  return { maxFlow, flows };
}
