// =============================================================================
// 网络单纯形 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { networkSimplex, type NsEdgeInput, type NsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    { from: 0, to: 1, cap: 4, cost: 2 },
    { from: 0, to: 2, cap: 2, cost: 1 },
    { from: 1, to: 2, cap: 2, cost: 3 },
    { from: 1, to: 3, cap: 3, cost: 1 },
    { from: 2, to: 3, cap: 5, cost: 1 },
  ] as NsEdgeInput[],
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
  input: { n: number; edges: NsEdgeInput[]; s: number; t: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges, s, t } = input;

  const flow = new Map<string, number>(edges.map((e) => [`${e.from}>${e.to}`, 0]));
  const highlightEdges = new Set<string>();
  let step = 0;
  let pivotCount = 0;

  const render = (note: { zh: string; en: string }, curFlow = 0, curCost = 0): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (i === s || i === t) role = 'pivot';
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
      if (highlightEdges.has(key)) role = 'compare';
      return { from: String(e.from), to: String(e.to), weight: e.cost, directed: true, role };
    });
    const aux = [
      { label: '步数', value: String(step), role: 'pivot' as BarRole },
      { label: 'pivot 次数', value: String(pivotCount), role: 'warn' as BarRole },
      { label: '当前流', value: String(curFlow), role: 'frontier' as BarRole },
      { label: '当前费用', value: String(curCost), role: 'warn' as BarRole },
      ...edges.map((e) => ({
        label: `${e.from}→${e.to}`,
        value: `${flow.get(`${e.from}>${e.to}`) ?? 0}/${e.cap} $${e.cost}`,
        role: 'default' as BarRole,
      })),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
    highlightEdges.clear();
  };

  render({ zh: `初始网络：源 ${s}，汇 ${t}`, en: `Initial network` });

  let curFlow = 0;
  let curCost = 0;

  const hooks: NsHooks = {
    onTree: (treeEdges) => {
      step += 1;
      treeEdges.forEach((e) => highlightEdges.add(`${e.from}>${e.to}`));
      render(
        {
          zh: `当前基（生成树）：${treeEdges.length} 条树边`,
          en: `Current basis: ${treeEdges.length} tree edges`,
        },
        curFlow,
        curCost,
      );
    },
    onPivot: (enter, leave, reducedCost) => {
      step += 1;
      pivotCount += 1;
      highlightEdges.add(`${enter.from}>${enter.to}`);
      render(
        {
          zh: `pivot：入边 ${enter.from}→${enter.to}，出边 ${leave.from}→${leave.to}，reduced cost = ${reducedCost}`,
          en: `pivot: enter ${enter.from}→${enter.to}, leave ${leave.from}→${leave.to}, reduced cost = ${reducedCost}`,
        },
        curFlow,
        curCost,
      );
    },
  };

  const result = networkSimplex(n, edges, s, t, hooks);
  curFlow = result.maxFlow;
  curCost = result.minCost;

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
      zh: `完成：最大流 = ${result.maxFlow}，最小费用 = ${result.minCost}`,
      en: `Done: max flow = ${result.maxFlow}, min cost = ${result.minCost}`,
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
    .setAux([
      { label: '最大流', value: String(result.maxFlow), role: 'final' as BarRole },
      { label: '最小费用', value: String(result.minCost), role: 'final' as BarRole },
      { label: 'pivot 次数', value: String(pivotCount), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
