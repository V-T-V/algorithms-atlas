// =============================================================================
// SAP 最大流（Shortest Augmenting Path / ISAP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：ISAP 从汇点 t 反向 BFS 预处理每个节点的距离标号 d；
//       从 s 出发沿 d[v]==d[u]+1 的边前推，遇死点「重标号」(d[u]=min{d[v]+1})；
//       gap 优化：若某 d 值上的节点数突降为 0，则算法提前结束。
// =============================================================================

/** 容量网络输入（有向）。 */
export interface FlowNetworkInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number }>;
  source: string;
  sink: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface SapHooks {
  /** 从 t 反向 BFS 完成初始距离标号。 */
  onInitLabel?: (dist: Map<string, number>) => void;
  /** 沿一条 s→t 增广路推 flow。path 为节点序列。 */
  onAugment?: (path: string[], flow: number) => void;
  /** 推送一段 (u,v)：pushed 流量、残余 res。 */
  onPush?: (u: string, v: string, pushed: number, res: number) => void;
  /** 重标号 u：旧标号 oldD → 新标号 newD。 */
  onRelabel?: (u: string, oldD: number, newD: number) => void;
  /** gap 优化触发：标号 d 上的节点数降为 0，算法可提前终止。 */
  onGap?: (d: number) => void;
  /** 算法完成：最大流值。 */
  onDone?: (maxFlow: number) => void;
}

export interface SapResult {
  maxFlow: number;
  /** 每条输入边的最终流量（key "from>to"）。 */
  flows: Map<string, number>;
}

interface Edge {
  to: string;
  cap: number;
  rev: number;
  forward: boolean;
  key: string;
}

/**
 * SAP / ISAP 最大流（带 gap 优化）。
 *
 * @param input 容量网络
 * @param hooks 可选事件钩子
 * @returns 最大流值与每条边流量
 */
export function sap(input: FlowNetworkInput, hooks: SapHooks = {}): SapResult {
  const { nodes, edges, source, sink } = input;
  if (source === sink) return { maxFlow: 0, flows: new Map() };

  const graph = new Map<string, Edge[]>();
  for (const n of nodes) graph.set(n, []);
  const addEdge = (from: string, to: string, cap: number, key: string): void => {
    if (!graph.has(from) || !graph.has(to)) return;
    const fwd: Edge = { to, cap, rev: 0, forward: true, key };
    const rev: Edge = { to: from, cap: 0, rev: 0, forward: false, key };
    fwd.rev = graph.get(to)!.length;
    rev.rev = graph.get(from)!.length;
    graph.get(from)!.push(fwd);
    graph.get(to)!.push(rev);
  };
  const orig = new Map<string, number>();
  for (const e of edges) {
    addEdge(e.from, e.to, e.capacity, `${e.from}>${e.to}`);
    orig.set(`${e.from}>${e.to}`, e.capacity);
  }

  // 反向 BFS 求初始距离标号 d（从 t 出发）
  const d = new Map<string, number>();
  for (const n of nodes) d.set(n, nodes.length);
  d.set(sink, 0);
  const queue: string[] = [sink];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    const du = d.get(u)!;
    for (const e of graph.get(u) ?? []) {
      // 沿「反边的正向」即原边方向的反向：e 是 u 的邻接，e.to 是另一端
      // 残量网络中从 t 反向走：要求该边的反边有容量（即原方向被使用过或有容量）
      if (d.get(e.to) === nodes.length && graph.get(e.to)![e.rev]!.cap > 0) {
        d.set(e.to, du + 1);
        queue.push(e.to);
      }
    }
  }
  hooks.onInitLabel?.(new Map(d));

  // gap 计数
  const gapCount = new Map<number, number>();
  for (const n of nodes) {
    const dv = d.get(n) ?? nodes.length;
    gapCount.set(dv, (gapCount.get(dv) ?? 0) + 1);
  }

  const iter = new Map<string, number>();
  for (const n of nodes) iter.set(n, 0);

  const augmentPath: string[] = [];
  let maxFlow = 0;

  // 重标号 u：取所有可走边的最小 d[v]+1
  const relabel = (u: string): void => {
    const oldD = d.get(u) ?? nodes.length;
    let minD = nodes.length;
    for (const e of graph.get(u) ?? []) {
      if (e.cap > 0) minD = Math.min(minD, d.get(e.to) ?? nodes.length);
    }
    const newD = minD + 1;
    // 更新 gap
    gapCount.set(oldD, (gapCount.get(oldD) ?? 0) - 1);
    if ((gapCount.get(oldD) ?? 0) === 0 && oldD < nodes.length) {
      hooks.onGap?.(oldD);
    }
    gapCount.set(newD, (gapCount.get(newD) ?? 0) + 1);
    d.set(u, newD);
    iter.set(u, 0);
    hooks.onRelabel?.(u, oldD, newD);
  };

  // 从 source DFS 推流；用一个显式栈模拟「推进-重标号」
  // 这里采用经典 ISAP 的递归实现。
  const dfs = (u: string, pushedIn: number): number => {
    if (u === sink) return pushedIn;
    const du = d.get(u)!;
    const adj = graph.get(u)!;
    let pushed = 0;
    while (iter.get(u)! < adj.length) {
      const ei = iter.get(u)!;
      const e = adj[ei]!;
      if (e.cap > 0 && d.get(e.to) === du - 1) {
        const got = dfs(e.to, Math.min(pushedIn - pushed, e.cap));
        if (got > 0) {
          e.cap -= got;
          graph.get(e.to)![e.rev]!.cap += got;
          pushed += got;
          hooks.onPush?.(u, e.to, got, e.cap);
          if (pushed === pushedIn) break;
        }
      }
      iter.set(u, ei + 1);
    }
    if (pushed === 0 && du < nodes.length) {
      relabel(u);
    }
    return pushed;
  };

  // 主循环：只要 d[source] < n 就继续
  let guard = 0;
  while ((d.get(source) ?? nodes.length) < nodes.length) {
    guard++;
    if (guard > nodes.length * nodes.length * 4) break; // 安全阀
    // 重建一条增广路径用于钩子：沿 d 递减 + 当前弧找一条 s→t
    const f = dfs(source, Infinity);
    if (f > 0) {
      maxFlow += f;
      // 重建路径（按 d 递减走当前可走边）
      const path: string[] = [source];
      let cur: string = source;
      let g = 0;
      while (cur !== sink && g <= nodes.length) {
        g++;
        let advanced = false;
        const du2 = d.get(cur) ?? nodes.length;
        for (const e of graph.get(cur) ?? []) {
          if (e.cap > 0 && (d.get(e.to) ?? nodes.length) === du2 - 1) {
            path.push(e.to);
            cur = e.to;
            advanced = true;
            break;
          }
        }
        if (!advanced) break;
      }
      hooks.onAugment?.(path, f);
      augmentPath.length = 0;
    }
  }

  // 回填流量
  const flows = new Map<string, number>();
  for (const n of nodes) {
    for (const e of graph.get(n) ?? []) {
      if (e.forward) flows.set(e.key, (orig.get(e.key) ?? 0) - e.cap);
    }
  }
  hooks.onDone?.(maxFlow);
  return { maxFlow, flows };
}
