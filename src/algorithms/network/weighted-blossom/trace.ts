// =============================================================================
// 加权 Blossom · 录制帧序列
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedBlossom, type WbEdge, type WbHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 6,
  edges: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 3 },
    { from: 1, to: 2, weight: 5 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 4, weight: 6 },
    { from: 3, to: 4, weight: 1 },
    { from: 3, to: 5, weight: 7 },
    { from: 4, to: 5, weight: 2 },
  ] as WbEdge[],
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.15, y: 0.3 },
  1: { x: 0.4, y: 0.15 },
  2: { x: 0.4, y: 0.6 },
  3: { x: 0.65, y: 0.15 },
  4: { x: 0.65, y: 0.6 },
  5: { x: 0.9, y: 0.4 },
};

export function buildTrace(input: { n: number; edges: WbEdge[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;

  const matchedSet = new Set<string>();
  const curBest = new Set<string>();
  let bestWeight = 0;
  let step = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      const role: BarRole = 'default';
      nodes.push({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const k = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      let role: BarRole = 'default';
      if (matchedSet.has(k)) role = 'final';
      if (curBest.has(k)) role = 'compare';
      return { from: String(e.from), to: String(e.to), weight: e.weight, directed: false, role };
    });
    const aux = [
      { label: '步数', value: String(step), role: 'pivot' as BarRole },
      { label: '当前最优权重', value: String(bestWeight), role: 'final' as BarRole },
      ...edges.map((e) => ({
        label: `${e.from}-${e.to}`,
        value: String(e.weight),
        role: 'default' as BarRole,
      })),
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
    curBest.clear();
  };

  render({ zh: `初始加权图（${n} 节点）`, en: `Initial weighted graph (${n} vertices)` });

  const hooks: WbHooks = {
    onImprove: (matching, total) => {
      step += 1;
      bestWeight = total;
      matchedSet.clear();
      for (const [a, b] of matching) matchedSet.add(a < b ? `${a}-${b}` : `${b}-${a}`);
      render({
        zh: `改进：权重 ${total}，匹配 ${matching.map((m) => m.join('-')).join(', ')}`,
        en: `Improved: weight ${total}, match ${matching.map((m) => m.join('-')).join(', ')}`,
      });
    },
    onConsider: (matching, total) => {
      curBest.clear();
      for (const [a, b] of matching) curBest.add(a < b ? `${a}-${b}` : `${b}-${a}`);
      render({
        zh: `考虑子集（DP 状态）：当前权重 ${total}`,
        en: `Consider subset (DP state): weight ${total}`,
      });
    },
  };

  const result = weightedBlossom(n, edges, hooks);

  matchedSet.clear();
  for (const [a, b] of result.matching) matchedSet.add(a < b ? `${a}-${b}` : `${b}-${a}`);

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
      zh: `完成：最大权匹配 ${result.matching.map((m) => m.join('-')).join(', ')}，总权重 ${result.totalWeight}`,
      en: `Done: MWPM ${result.matching.map((m) => m.join('-')).join(', ')}, total weight ${result.totalWeight}`,
    })
    .setGraph(
      nodes,
      edges.map((e) => {
        const k = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
        return {
          from: String(e.from),
          to: String(e.to),
          weight: e.weight,
          directed: false,
          role: (matchedSet.has(k) ? 'final' : 'default') as BarRole,
        };
      }),
    )
    .setAux([
      { label: '最大权', value: String(result.totalWeight), role: 'final' as BarRole },
      { label: '匹配数', value: String(result.matching.length), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
