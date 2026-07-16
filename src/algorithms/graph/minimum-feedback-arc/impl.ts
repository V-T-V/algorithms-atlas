// =============================================================================
// 最小反馈弧集（Minimum Feedback Arc Set）· 纯算法实现
// Eades-Levitt-Thistlethwaite 启发式（构造 s1..s2 的线性序）：
//   反复把「无入度的源点」放入序列头 s1，把「无出度的汇点」放入序列尾 s2，
//   再对剩余图中处理「出度-入度最大」的点放入 s1。反馈弧集 = 逆向边集合。
//   该启发式给出常数近似比（竞赛图上最优），但通用图上是近似算法。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface FbaHooks {
  onPickSource?: (v: string) => void;
  onPickSink?: (v: string) => void;
  onPickMax?: (v: string, delta: number) => void;
  onResult?: (feedback: Array<{ from: string; to: string }>, order: string[]) => void;
}

export interface FbaResult {
  feedback: Array<{ from: string; to: string }>;
  order: string[];
}

export function minimumFeedbackArc(input: GraphInput, hooks: FbaHooks = {}): FbaResult {
  const { nodes, edges } = input;
  // 工作图：动态维护 in/out 邻接
  const outAdj = new Map<string, Set<string>>();
  const inAdj = new Map<string, Set<string>>();
  for (const v of nodes) {
    outAdj.set(v, new Set());
    inAdj.set(v, new Set());
  }
  // 去重边
  const edgeSet = new Set<string>();
  for (const e of edges) {
    if (!outAdj.has(e.from) || !inAdj.has(e.to)) continue;
    const key = `${e.from}>${e.to}`;
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);
    outAdj.get(e.from)!.add(e.to);
    inAdj.get(e.to)!.add(e.from);
  }

  const remaining = new Set<string>(nodes);
  const s1: string[] = [];
  const s2: string[] = [];

  const outDeg = (v: string): number => {
    let c = 0;
    for (const u of outAdj.get(v) ?? []) if (remaining.has(u)) c++;
    return c;
  };
  const inDeg = (v: string): number => {
    let c = 0;
    for (const u of inAdj.get(v) ?? []) if (remaining.has(u)) c++;
    return c;
  };

  while (remaining.size > 0) {
    // 1) 反复取「无入度的源点」放入 s1
    let changed = true;
    while (changed) {
      changed = false;
      const sources: string[] = [];
      for (const v of remaining) if (inDeg(v) === 0) sources.push(v);
      for (const v of sources) {
        remaining.delete(v);
        s1.push(v);
        hooks.onPickSource?.(v);
        changed = true;
      }
    }
    // 2) 反复取「无出度的汇点」放入 s2（头插）
    changed = true;
    while (changed) {
      changed = false;
      const sinks: string[] = [];
      for (const v of remaining) if (outDeg(v) === 0) sinks.push(v);
      for (const v of sinks) {
        remaining.delete(v);
        s2.unshift(v);
        hooks.onPickSink?.(v);
        changed = true;
      }
    }
    // 3) 取出度-入度最大者放入 s1
    if (remaining.size > 0) {
      let bestV: string | null = null;
      let bestDelta = -Infinity;
      for (const v of remaining) {
        const d = outDeg(v) - inDeg(v);
        if (d > bestDelta) {
          bestDelta = d;
          bestV = v;
        }
      }
      if (bestV !== null) {
        remaining.delete(bestV);
        s1.push(bestV);
        hooks.onPickMax?.(bestV, bestDelta);
      }
    }
  }

  const order = [...s1, ...s2];
  const pos = new Map<string, number>();
  order.forEach((v, i) => pos.set(v, i));

  // 反馈弧 = 所有 from 在 to 之后的边
  const feedback: Array<{ from: string; to: string }> = [];
  for (const e of edges) {
    const pf = pos.get(e.from);
    const pt = pos.get(e.to);
    if (pf === undefined || pt === undefined) continue;
    if (pf > pt) feedback.push({ from: e.from, to: e.to });
  }

  hooks.onResult?.(feedback, order);
  return { feedback, order };
}
