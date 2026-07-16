// =============================================================================
// 可达节点 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reachableNodes, type GraphInput, type ReachableHooks } from './impl.ts';

export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
  directed: true,
};
const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.35, y: 0.2 },
  C: { x: 0.35, y: 0.8 },
  D: { x: 0.6, y: 0.5 },
  E: { x: 0.85, y: 0.5 },
  F: { x: 0.6, y: 0.9 },
};
export const DEFAULT_SOURCE = 'A';

export function buildTrace(input: GraphInput = DEFAULT_INPUT, source = DEFAULT_SOURCE): Frame[] {
  const rec = new TraceRecorder();
  const visited = new Set<string>();
  let cur: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (id === source
        ? 'compare'
        : id === cur
          ? 'pivot'
          : visited.has(id)
            ? 'final'
            : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => ({ from: e.from, to: e.to, directed: true }));
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `源点 ${source}`, en: `Source ${source}` });

  const hooks: ReachableHooks = {
    onVisit: (node) => {
      visited.add(node);
      cur = node;
      render({ zh: `访问 ${node}`, en: `Visit ${node}` });
    },
    onDone: (list) => {
      cur = null;
      render({ zh: `可达 ${list.length} 个`, en: `${list.length} reachable` });
    },
  };

  reachableNodes(input, source, hooks);
  return rec.build();
}
