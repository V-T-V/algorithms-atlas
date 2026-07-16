// =============================================================================
// 边着色（贪心）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { edgeColoringGreedy, type EdgeColoringHooks, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.2 },
  B: { x: 0.8, y: 0.2 },
  C: { x: 0.8, y: 0.8 },
  D: { x: 0.2, y: 0.8 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const edgeColors = new Array<number>(input.edges.length).fill(-1);
  let curIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
    }));
    const edges: GraphEdge[] = input.edges.map((e, i) => ({
      from: e.from,
      to: e.to,
      role: (i === curIdx ? 'pivot' : edgeColors[i]! >= 0 ? 'final' : 'default') as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux(
        edgeColors.map((c, i) => ({
          label: `e${i}`,
          value: c < 0 ? '-' : String(c),
          role: 'frontier' as const,
        })),
      )
      .commit();
  };

  render({ zh: '输入图', en: 'Input graph' });

  const hooks: EdgeColoringHooks = {
    onColor: (idx, from, to, color) => {
      edgeColors[idx] = color;
      curIdx = idx;
      render({ zh: `${from}-${to} ← 颜色 ${color}`, en: `${from}-${to} <- color ${color}` });
    },
    onDone: (_c, num) => {
      curIdx = -1;
      render({ zh: `完成，用 ${num} 色`, en: `Done, ${num} colors` });
    },
  };

  edgeColoringGreedy(input, hooks);
  return rec.build();
}
