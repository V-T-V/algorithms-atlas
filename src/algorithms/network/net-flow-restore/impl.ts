// 预流复原 · 实现

export interface PreflowEdge {
  from: string;
  to: string;
  /** 当前预流（可能产生超额）。 */
  flow: number;
  capacity: number;
}

export interface RestoreHooks {
  onPush?: (from: string, to: string, amount: number, excess: number) => void;
}

/** 计算各节点超额：入流 - 出流（源点为负，汇点为正）。 */
export function computeExcess(
  edges: PreflowEdge[],
  nodes: string[],
  source: string,
  sink: string,
): Map<string, number> {
  const excess = new Map<string, number>();
  for (const n of nodes) excess.set(n, 0);
  for (const e of edges) {
    if (e.flow === 0) continue;
    excess.set(e.to, (excess.get(e.to) ?? 0) + e.flow);
    excess.set(e.from, (excess.get(e.from) ?? 0) - e.flow);
  }
  // 源汇不参与复原
  excess.set(source, 0);
  excess.set(sink, 0);
  return excess;
}

/** 将预流复原为合法流：把超额节点沿其入流边推回。 */
export function restoreFlow(
  edges: PreflowEdge[],
  nodes: string[],
  source: string,
  sink: string,
  hooks: RestoreHooks = {},
): PreflowEdge[] {
  const work = edges.map((e) => ({ ...e }));
  const excess = computeExcess(work, nodes, source, sink);

  // 反复处理：找第一个超额节点，沿其入流边减少流量
  let changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) {
      if (n === source || n === sink) continue;
      const ex = excess.get(n) ?? 0;
      if (ex <= 0) continue;
      // 找一条流入 n 的边，把流量往回推
      const inEdge = work.find((e) => e.to === n && e.flow > 0);
      if (!inEdge) continue;
      const push = Math.min(ex, inEdge.flow);
      inEdge.flow -= push;
      excess.set(n, ex - push);
      excess.set(inEdge.from, (excess.get(inEdge.from) ?? 0) + push);
      hooks.onPush?.(n, inEdge.from, push, excess.get(n)!);
      changed = true;
    }
  }
  return work;
}
