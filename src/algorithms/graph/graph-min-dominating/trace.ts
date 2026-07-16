// =============================================================================
// 最小支配集（贪心近似）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minDominatingSetGreedy, type DominatingHooks, type GraphInput } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.3, y: 0.5 },
  C: { x: 0.5, y: 0.5 },
  D: { x: 0.7, y: 0.5 },
  E: { x: 0.9, y: 0.5 },
};

export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chosen = new Set<string>();
  const dominated = new Set<string>();
  let cur: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (id === cur
        ? 'pivot'
        : chosen.has(id)
          ? 'final'
          : dominated.has(id)
            ? 'frontier'
            : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => ({ from: e.from, to: e.to }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: '输入图', en: 'Input graph' });

  const hooks: DominatingHooks = {
    onPick: (node, gain) => {
      chosen.add(node);
      cur = node;
      // 标记被支配
      dominated.add(node);
      for (const e of input.edges) {
        if (e.from === node) dominated.add(e.to);
        if (e.to === node) dominated.add(e.from);
      }
      render({ zh: `选 ${node}（新支配 ${gain}）`, en: `Pick ${node} (covers ${gain})` });
    },
    onDone: (set, size) => {
      cur = null;
      render({ zh: `完成：${size} 个节点`, en: `Done: ${size} nodes` });
    },
  };

  minDominatingSetGreedy(input, hooks);
  return rec.build();
}
