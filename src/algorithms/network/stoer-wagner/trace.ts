// =============================================================================
// Stoer-Wagner 全局最小割 · 录制帧序列
// 用 setGraph 展示无向加权图；割边标 'warn'，最优一侧标 'final'。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoerWagner, type StoerWagnerHooks, type WeightedEdgeInput } from './impl.ts';

/** 演示图：Karger 经典示例，最小割 = 2。 */
export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    { from: 0, to: 1, weight: 1 },
    { from: 0, to: 2, weight: 1 },
    { from: 1, to: 2, weight: 2 },
    { from: 1, to: 3, weight: 3 },
    { from: 2, to: 3, weight: 3 },
  ] as WeightedEdgeInput[],
};

const POS: Record<number, { x: number; y: number }> = {
  0: { x: 0.15, y: 0.5 },
  1: { x: 0.5, y: 0.2 },
  2: { x: 0.5, y: 0.8 },
  3: { x: 0.88, y: 0.5 },
};

export function buildTrace(
  input: { n: number; edges: WeightedEdgeInput[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { n, edges } = input;
  let bestCut = Infinity;
  let phase = 0;

  const render = (
    note: { zh: string; en: string },
    sideSet: Set<number> = new Set(),
    cutEdges: Set<string> = new Set(),
  ): void => {
    const nodes: GraphNode[] = [];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (sideSet.has(i)) role = 'final';
      nodes.push({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role,
      });
    }
    const e2: GraphEdge[] = edges.map((e) => {
      const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
      let role: BarRole = 'default';
      if (cutEdges.has(key)) role = 'warn';
      return { from: String(e.from), to: String(e.to), weight: e.weight, role };
    });
    const aux = [
      { label: '轮次', value: phase > 0 ? `第 ${phase} 轮` : '初始', role: 'pivot' as BarRole },
      {
        label: '当前最优割',
        value: bestCut === Infinity ? '∞' : String(bestCut),
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setGraph(nodes, e2).setAux(aux).commit();
  };

  render({ zh: '初始无向加权图', en: 'Initial undirected weighted graph' });

  const computeCutEdges = (side: number[]): Set<string> => {
    const s = new Set(side);
    const out = new Set<string>();
    for (const e of edges) {
      const inSide = s.has(e.from) !== s.has(e.to);
      if (inSide) {
        out.add(e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`);
      }
    }
    return out;
  };

  const hooks: StoerWagnerHooks = {
    onPhase: (p) => {
      phase = p;
    },
    onAddToA: () => {},
    onContract: (_s, _t, phaseCut) => {
      render({
        zh: `本轮 s-t 收缩，本轮割 = ${phaseCut}`,
        en: `Phase s-t contraction, phase cut = ${phaseCut}`,
      });
    },
    onImprove: (cutValue, side) => {
      bestCut = cutValue;
      const cutEdges = computeCutEdges(side);
      render(
        {
          zh: `发现更小割 = ${cutValue}，一侧 {${side.join(', ')}}`,
          en: `Smaller cut = ${cutValue}, side {${side.join(', ')}}`,
        },
        new Set(side),
        cutEdges,
      );
    },
  };

  const result = stoerWagner(n, edges, hooks);

  // 终态
  const finalSide = new Set(result.side);
  const finalCutEdges = computeCutEdges(result.side);
  const nodes: GraphNode[] = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: String(i),
      label: String(i),
      x: POS[i]?.x ?? 0.5,
      y: POS[i]?.y ?? 0.5,
      role: (finalSide.has(i) ? 'final' : 'frontier') as BarRole,
    });
  }
  rec
    .begin({
      zh: `最小割 = ${result.cutValue}，一侧 {${result.side.join(', ')}}`,
      en: `Min cut = ${result.cutValue}, side {${result.side.join(', ')}}`,
    })
    .setGraph(
      nodes,
      edges.map((e) => {
        const key = e.from < e.to ? `${e.from}-${e.to}` : `${e.to}-${e.from}`;
        return {
          from: String(e.from),
          to: String(e.to),
          weight: e.weight,
          role: (finalCutEdges.has(key) ? 'warn' : 'default') as BarRole,
        };
      }),
    )
    .setAux([
      { label: '最小割值', value: String(result.cutValue), role: 'final' as BarRole },
      { label: '一侧', value: result.side.join(','), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
