// =============================================================================
// 最小费用最大流 · 录制帧序列
// 用 setGraph 展示流网络（边权=费用），节点高亮增广路；setAux 展示各边 flow/cap/cost。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCostMaxFlow, type McmfEdgeInput, type McmfHooks } from './impl.ts';

/** 演示网络：4 节点，源 0，汇 3。两条并行路：上 0→1→3 费用较低。 */
export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    { from: 0, to: 1, cap: 3, cost: 1 },
    { from: 0, to: 2, cap: 2, cost: 4 },
    { from: 1, to: 3, cap: 2, cost: 1 },
    { from: 2, to: 3, cap: 3, cost: 2 },
    { from: 1, to: 2, cap: 1, cost: 1 },
  ] as McmfEdgeInput[],
  s: 0,
  t: 3,
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.1, y: 0.5 },
  1: { x: 0.4, y: 0.2 },
  2: { x: 0.4, y: 0.8 },
  3: { x: 0.9, y: 0.5 },
};

export function buildTrace(
  input: { n: number; edges: McmfEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const pathEdges = new Set<string>();
  let curPath: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
      if (curPath.includes(i)) role = 'compare';
      nodes.push({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      let role: BarRole = 'default';
      if (f > 0) role = 'frontier';
      if (pathEdges.has(key)) role = 'compare';
      // weight 显示费用
      return { from: String(e.from), to: String(e.to), weight: e.cost, directed: true, role };
    });
    const aux = edges.map((e) => {
      const key = `${e.from}>${e.to}`;
      const f = flow.get(key) ?? 0;
      return {
        label: `${e.from}→${e.to} (cost ${e.cost})`,
        value: `${f}/${e.cap}`,
        role: (pathEdges.has(key) ? 'compare' : f > 0 ? 'frontier' : 'default') as BarRole,
      };
    });
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({
    zh: `初始网络：源 ${s}，汇 ${t}（边权为单位费用）`,
    en: `Initial: source ${s}, sink ${t} (edge weight = unit cost)`,
  });

  const hooks: McmfHooks = {
    onAugment: (path, f, pathCost, totalFlow, totalCost) => {
      pathEdges.clear();
      for (let i = 0; i + 1 < path.length; i++) {
        pathEdges.add(`${path[i]!}>${path[i + 1]!}`);
      }
      curPath = path;
      render({
        zh: `SPFA 增广 ${path.join('→')}，瓶颈 ${f}，路费 ${pathCost}（累计流 ${totalFlow}，累计费 ${totalCost}）`,
        en: `SPFA augment ${path.join('→')}, bottleneck ${f}, path cost ${pathCost} (flow ${totalFlow}, cost ${totalCost})`,
      });
      for (let i = 0; i + 1 < path.length; i++) {
        const key = `${path[i]!}>${path[i + 1]!}`;
        if (flow.has(key)) flow.set(key, (flow.get(key) ?? 0) + f);
      }
      pathEdges.clear();
      curPath = [];
    },
  };

  const result = minCostMaxFlow(n, edges, s, t, hooks);

  // 终态
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: 'final' as BarRole,
    });
  }
  rec
    .begin({
      zh: `完成，最大流 = ${result.maxFlow}，最小费用 = ${result.minCost}`,
      en: `Done, max flow = ${result.maxFlow}, min cost = ${result.minCost}`,
    })
    .setGraph(
      nodes,
      edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        weight: e.cost,
        directed: true,
        role: ((flow.get(`${e.from}>${e.to}`) ?? 0) > 0 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux(
      edges.map((e) => ({
        label: `${e.from}→${e.to} (cost ${e.cost})`,
        value: `${flow.get(`${e.from}>${e.to}`) ?? 0}/${e.cap}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
