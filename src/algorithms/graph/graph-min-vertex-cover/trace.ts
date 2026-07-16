// =============================================================================
// 最小点覆盖（近似）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minVertexCoverApprox, type GraphInput, type VertexCoverHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.05, y: 0.5 },
  B: { x: 0.23, y: 0.5 },
  C: { x: 0.41, y: 0.5 },
  D: { x: 0.59, y: 0.5 },
  E: { x: 0.77, y: 0.5 },
  F: { x: 0.95, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cover = new Set<string>();
  let lastEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (cover.has(id) ? 'final' : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      role:
        lastEdge &&
        ((lastEdge.from === e.from && lastEdge.to === e.to) ||
          (lastEdge.from === e.to && lastEdge.to === e.from))
          ? ('pivot' as BarRole)
          : undefined,
    }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: '输入图', en: 'Input graph' });

  const hooks: VertexCoverHooks = {
    onPick: (u, v) => {
      cover.add(u);
      cover.add(v);
      lastEdge = { from: u, to: v };
      render({ zh: `取边 ${u}-${v}，两点入覆盖`, en: `Pick ${u}-${v}, both to cover` });
    },
    onDone: (cv, size) => {
      lastEdge = null;
      render({ zh: `完成：${size} 个点`, en: `Done: ${size} vertices` });
    },
  };

  minVertexCoverApprox(input, hooks);
  return rec.build();
}
