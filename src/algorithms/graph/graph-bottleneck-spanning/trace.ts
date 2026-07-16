// =============================================================================
// 瓶颈生成树 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bottleneckSpanningTree, type BottleneckHooks, type WeightedGraphInput } from './impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 3 },
    { from: 'C', to: 'E', weight: 6 },
    { from: 'D', to: 'E', weight: 7 },
  ],
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.15, y: 0.3 },
  B: { x: 0.45, y: 0.2 },
  C: { x: 0.4, y: 0.7 },
  D: { x: 0.7, y: 0.3 },
  E: { x: 0.9, y: 0.7 },
};

export function buildTrace(input: WeightedGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const treeEdges = new Set<string>();
  let curMax = 0;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = `${e.from}-${e.to}`;
      const kr = `${e.to}-${e.from}`;
      const isTree = treeEdges.has(k) || treeEdges.has(kr);
      return {
        from: e.from,
        to: e.to,
        weight: e.weight,
        role: (e.weight === curMax && isTree ? 'pivot' : isTree ? 'final' : 'default') as BarRole,
      };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: '输入图', en: 'Input graph' });

  const hooks: BottleneckHooks = {
    onAddEdge: (from, to, w) => {
      treeEdges.add(`${from}-${to}`);
      if (w > curMax) curMax = w;
      render({
        zh: `加入 ${from}-${to}(w=${w})，当前瓶颈=${curMax}`,
        en: `Add ${from}-${to}(w=${w}), bottleneck=${curMax}`,
      });
    },
    onDone: (bn, total) => {
      render({ zh: `瓶颈=${bn} 总权=${total}`, en: `bottleneck=${bn} total=${total}` });
    },
  };

  bottleneckSpanningTree(input, hooks);
  return rec.build();
}
