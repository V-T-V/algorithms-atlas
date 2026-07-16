// =============================================================================
// Welsh-Powell 着色 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { welshPowell, type ColoringHooks, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.2 },
  B: { x: 0.5, y: 0.2 },
  C: { x: 0.5, y: 0.7 },
  D: { x: 0.8, y: 0.5 },
  E: { x: 0.8, y: 0.9 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const color = new Map<string, number>();
  let cur: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: `${id}${color.has(id) ? `:${color.get(id)}` : ''}`,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (id === cur ? 'pivot' : color.has(id) ? 'final' : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => ({ from: e.from, to: e.to }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: '输入图', en: 'Input graph' });

  const hooks: ColoringHooks = {
    onOrder: (order) => {
      rec
        .begin({ zh: `按度降序：${order.join(' ')}`, en: `By degree: ${order.join(' ')}` })
        .setAux([{ label: '顺序', value: order.join(' '), role: 'frontier' }])
        .commit();
    },
    onColor: (node, c) => {
      color.set(node, c);
      cur = node;
      render({ zh: `${node} ← 颜色 ${c}`, en: `${node} <- color ${c}` });
    },
    onDone: (_c, num) => {
      cur = null;
      render({ zh: `完成，用 ${num} 色`, en: `Done, ${num} colors` });
    },
  };

  welshPowell(input, hooks);

  return rec.build();
}
