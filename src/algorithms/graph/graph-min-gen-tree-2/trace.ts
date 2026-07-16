// =============================================================================
// 最小生成树（Prim）· 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { primMst, type PrimHooks, type WeightedGraphInput } from './impl.ts';

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
export const DEFAULT_START = 'A';

export function buildTrace(
  input: WeightedGraphInput = DEFAULT_INPUT,
  start = DEFAULT_START,
): Frame[] {
  const rec = new TraceRecorder();
  const inTree = new Set<string>();
  const treeEdgeSet = new Set<string>();
  let curEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (inTree.has(id) ? 'final' : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => {
      const k = `${e.from}-${e.to}`;
      const kr = `${e.to}-${e.from}`;
      let role: BarRole | undefined;
      if (treeEdgeSet.has(k) || treeEdgeSet.has(kr)) role = 'final';
      else if (
        curEdge &&
        ((curEdge.from === e.from && curEdge.to === e.to) ||
          (curEdge.from === e.to && curEdge.to === e.from))
      )
        role = 'pivot';
      return { from: e.from, to: e.to, weight: e.weight, role };
    });
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `起点 ${start}`, en: `Start ${start}` });

  const hooks: PrimHooks = {
    onAddVertex: (v) => {
      inTree.add(v);
      render({ zh: `加入 ${v}`, en: `Add ${v}` });
    },
    onAddEdge: (from, to, w) => {
      treeEdgeSet.add(`${from}-${to}`);
      curEdge = { from, to };
      render({ zh: `加入边 ${from}-${to} (w=${w})`, en: `Add edge ${from}-${to} (w=${w})` });
    },
    onDone: (total) => {
      curEdge = null;
      render({ zh: `MST 总权=${total}`, en: `MST weight=${total}` });
    },
  };

  primMst(input, start, hooks);
  return rec.build();
}
