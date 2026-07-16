// =============================================================================
// 最小割 · 录制帧序列
// 用 setGraph 展示无向加权图，割边标 'warn'，保留侧标 'final'；
// setAux 展示当前轮次与本轮割值 / 全局最优割。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minCut, type GraphInput, type MinCutHooks } from './impl.ts';

/**
 * 演示图：经典 Karger 最小割示例，最小割 = 2。
 * 节点 A/B/C/D，割 {A} | {B,C,D} 的边为 A-B(1) 与 A-C(1)，共 2。
 */
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 3 },
  ],
};

/** 节点归一化坐标。 */
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.15, y: 0.5 },
  B: { x: 0.5, y: 0.2 },
  C: { x: 0.5, y: 0.8 },
  D: { x: 0.88, y: 0.5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const nodeIds = [...input.nodes];
  let bestCut = Infinity;
  let phaseNum = 0;

  const edgeKey = (a: string, b: string): string => (a < b ? `${a}-${b}` : `${b}-${a}`);

  const render = (
    note: { zh: string; en: string },
    sideSet: Set<string> = new Set(),
    cutEdges: Set<string> = new Set(),
  ): void => {
    const nodes: GraphNode[] = nodeIds.map((id) => {
      let role: BarRole = 'default';
      if (sideSet.has(id)) role = 'final';
      return {
        id,
        label: id,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role,
      };
    });
    const edges: GraphEdge[] = input.edges.map((e) => {
      const key = edgeKey(e.from, e.to);
      let role: BarRole = 'default';
      if (cutEdges.has(key)) role = 'warn';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    const aux = [
      {
        label: '轮次',
        value: phaseNum > 0 ? `第 ${phaseNum} 轮` : '尚未开始',
        role: 'pivot' as BarRole,
      },
      {
        label: '当前最优割',
        value: bestCut === Infinity ? '∞' : String(bestCut),
        role: 'final' as BarRole,
      },
      ...input.edges.map((e) => ({
        label: `${e.from}—${e.to}`,
        value: String(e.weight),
        role: (cutEdges.has(edgeKey(e.from, e.to)) ? 'warn' : 'default') as BarRole,
      })),
    ];
    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
  };

  // 计算某一侧 side 与其余之间的割边
  const computeCutEdges = (side: string[]): Set<string> => {
    const s = new Set(side);
    const out = new Set<string>();
    for (const e of input.edges) {
      const inSide = s.has(e.from) !== s.has(e.to); // 异侧
      if (inSide) out.add(edgeKey(e.from, e.to));
    }
    return out;
  };

  render({ zh: '初始无向加权图', en: 'Initial undirected weighted graph' });

  const hooks: MinCutHooks = {
    onPhase: (phase) => {
      phaseNum = phase;
    },
    onAddToA: () => {
      // 细节步骤不渲染，避免帧过多
    },
    onContract: (_s, _t, wOfCut) => {
      render({
        zh: `本轮 s-t 收缩，本轮割 = ${wOfCut}`,
        en: `This phase s-t contraction, phase cut = ${wOfCut}`,
      });
    },
    onImprove: (cutValue, side) => {
      bestCut = cutValue;
      const cutEdges = computeCutEdges(side);
      render(
        {
          zh: `发现更小割 = ${cutValue}，一侧 = {${side.join(', ')}}`,
          en: `Smaller cut found = ${cutValue}, side = {${side.join(', ')}}`,
        },
        new Set(side),
        cutEdges,
      );
    },
  };

  const result = minCut(input, hooks);

  // 终态：高亮最小割
  const finalCutEdges = computeCutEdges(result.side);
  const finalSide = new Set(result.side);
  const nodes: GraphNode[] = nodeIds.map((id) => ({
    id,
    label: id,
    x: POS[id]?.x ?? 0.5,
    y: POS[id]?.y ?? 0.5,
    role: (finalSide.has(id) ? 'final' : 'frontier') as BarRole,
  }));
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.weight,
    role: (finalCutEdges.has(edgeKey(e.from, e.to)) ? 'warn' : 'default') as BarRole,
  }));
  rec
    .begin({
      zh: `最小割 = ${result.cutValue}，一侧 {${result.side.join(', ')}} | 另一侧 {${result.otherSide.join(', ')}}`,
      en: `Min cut = ${result.cutValue}, side {${result.side.join(', ')}} | other {${result.otherSide.join(', ')}}`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '最小割值', value: String(result.cutValue), role: 'final' },
      { label: '一侧', value: result.side.join(','), role: 'final' },
      { label: '另一侧', value: result.otherSide.join(','), role: 'final' },
    ])
    .commit();

  return rec.build();
}
