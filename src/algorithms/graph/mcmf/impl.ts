// =============================================================================
// 最小费用最大流（Min Cost Max Flow）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：在残量网络上反复用 SPFA（可处理负费用反边）找 s→t 最短（最廉价）增广路，
//       沿该路推流直至流量上限；累计流与费用。即 SSP（Successive Shortest Path）。
// =============================================================================

/** 费用流网络输入（有向）。 */
export interface FlowNetworkInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; capacity: number; cost: number }>;
  source: string;
  sink: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface McmfHooks {
  /** 一轮 SPFA 找到最短费用路径 path，单步流量 flow，单位费用 unitCost。 */
  onAugment?: (path: string[], flow: number, unitCost: number) => void;
  /** 推送一段 (u,v)：pushed 流量、单位费用 cost。 */
  onPush?: (u: string, v: string, pushed: number, unitCost: number) => void;
  /** 算法完成：总流量 totalFlow、总费用 totalCost。 */
  onDone?: (totalFlow: number, totalCost: number) => void;
}

export interface McmfResult {
  /** 最大流量。 */
  maxFlow: number;
  /** 最小费用（流量最大时的费用最小）。 */
  minCost: number;
  /** 每条输入边的最终流量（key "from>to"）。 */
  flows: Map<string, number>;
}

/** 内部边（成对存储支持反边）。 */
interface Edge {
  to: string;
  cap: number;
  cost: number;
  rev: number;
  forward: boolean;
  key: string;
}

/**
 * 最小费用最大流（SSP + SPFA）。
 *
 * @param input 费用流网络
 * @param hooks 可选事件钩子
 * @returns 最大流、最小费用、每条边流量
 */
export function mcmf(input: FlowNetworkInput, hooks: McmfHooks = {}): McmfResult {
  const { nodes, edges, source, sink } = input;
  if (source === sink) return { maxFlow: 0, minCost: 0, flows: new Map() };

  const graph = new Map<string, Edge[]>();
  for (const n of nodes) graph.set(n, []);
  const keyToFlow = new Map<string, number>();

  const addEdge = (from: string, to: string, cap: number, cost: number, key: string): void => {
    if (!graph.has(from) || !graph.has(to)) return;
    const fwd: Edge = { to, cap, cost, rev: 0, forward: true, key };
    const rev: Edge = { to: from, cap: 0, cost: -cost, rev: 0, forward: false, key };
    fwd.rev = graph.get(to)!.length;
    rev.rev = graph.get(from)!.length;
    graph.get(from)!.push(fwd);
    graph.get(to)!.push(rev);
  };

  for (const e of edges) {
    addEdge(e.from, e.to, e.capacity, e.cost, `${e.from}>${e.to}`);
    keyToFlow.set(`${e.from}>${e.to}`, 0);
  }

  // SPFA 找 s→t 最短路（基于费用）。返回是否找到，并填入 dist/preEdge,preNode。
  const dist = new Map<string, number>();
  const inQueue = new Map<string, boolean>();
  const preEdge = new Map<string, number>();
  const preNode = new Map<string, string | null>();

  const spfa = (): boolean => {
    for (const n of nodes) {
      dist.set(n, Infinity);
      inQueue.set(n, false);
      preNode.set(n, null);
    }
    dist.set(source, 0);
    inQueue.set(source, true);
    const queue: string[] = [source];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      inQueue.set(u, false);
      const du = dist.get(u)!;
      const adj = graph.get(u) ?? [];
      for (let i = 0; i < adj.length; i++) {
        const e = adj[i]!;
        if (e.cap > 0) {
          const nd = du + e.cost;
          if (nd < (dist.get(e.to) ?? Infinity)) {
            dist.set(e.to, nd);
            preEdge.set(e.to, i);
            preNode.set(e.to, u);
            if (!inQueue.get(e.to)) {
              inQueue.set(e.to, true);
              queue.push(e.to);
            }
          }
        }
      }
    }
    return (dist.get(sink) ?? Infinity) < Infinity;
  };

  let maxFlow = 0;
  let minCost = 0;

  while (spfa()) {
    // 沿前驱链求可推最大流量
    let bottle = Infinity;
    let v: string = sink;
    while (v !== source) {
      const u = preNode.get(v)!;
      const ei = preEdge.get(v)!;
      const e = graph.get(u)![ei]!;
      if (e.cap < bottle) bottle = e.cap;
      v = u;
    }
    // 推流
    v = sink;
    const path: string[] = [sink];
    const unitCost = dist.get(sink) ?? 0;
    while (v !== source) {
      const u = preNode.get(v)!;
      const ei = preEdge.get(v)!;
      const e = graph.get(u)![ei]!;
      e.cap -= bottle;
      graph.get(v)![e.rev]!.cap += bottle;
      hooks.onPush?.(u, v, bottle, e.cost);
      path.push(u);
      v = u;
    }
    path.reverse();
    maxFlow += bottle;
    minCost += bottle * unitCost;
    hooks.onAugment?.(path, bottle, unitCost);
  }

  // 回填每条输入边流量
  const flows = new Map<string, number>();
  for (const n of nodes) {
    const adj = graph.get(n) ?? [];
    for (const e of adj) {
      if (e.forward) flows.set(e.key, e.cap); // e.cap 现在是残余；流量 = 原容量 - 残余
    }
  }
  // 重新计算流量 = 原始容量 - 残余
  const orig = new Map<string, number>();
  for (const e of edges) orig.set(`${e.from}>${e.to}`, e.capacity);
  for (const [k, res] of flows) flows.set(k, (orig.get(k) ?? 0) - res);

  hooks.onDone?.(maxFlow, minCost);
  return { maxFlow, minCost, flows };
}
