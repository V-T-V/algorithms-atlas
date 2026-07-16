// Gusfield Gomory-Hu 树 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gusfieldTree, treeMinCut, type Gh2Edge } from './impl.ts';

export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 4 },
    { from: 2, to: 3, cap: 3 },
    { from: 0, to: 3, cap: 5 },
    { from: 1, to: 3, cap: 2 },
  ] as Gh2Edge[],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { tree, edges } = gusfieldTree(input.n, input.edges);
  const POS: Record<number, { x: number; y: number }> = {
    0: { x: 0.2, y: 0.3 },
    1: { x: 0.5, y: 0.15 },
    2: { x: 0.8, y: 0.3 },
    3: { x: 0.5, y: 0.7 },
  };
  const nodes: GraphNode[] = Array.from({ length: input.n }, (_, i) => ({
    id: String(i),
    label: String(i),
    x: POS[i]?.x ?? 0.5,
    y: POS[i]?.y ?? 0.5,
    role: 'default' as BarRole,
  }));
  const treeEdges: GraphEdge[] = edges.map((e) => ({
    from: String(e.from),
    to: String(e.to),
    weight: e.weight,
    directed: false,
    role: 'final' as BarRole,
  }));

  rec
    .begin({ zh: `原图 ${input.n} 节点`, en: `Original graph ${input.n} nodes` })
    .setGraph(
      Array.from({ length: input.n }, (_, i) => ({
        id: String(i),
        label: String(i),
        x: POS[i]?.x ?? 0.5,
        y: POS[i]?.y ?? 0.5,
        role: 'default' as BarRole,
      })),
      input.edges.map((e) => ({
        from: String(e.from),
        to: String(e.to),
        weight: e.cap,
        directed: false,
        role: 'frontier' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({
      zh: `Gomory-Hu 树：${edges.length} 条边`,
      en: `Gomory-Hu tree: ${edges.length} edges`,
    })
    .setGraph(nodes, treeEdges)
    .setAux(
      edges.map((e) => ({
        label: `${e.from}-${e.to}`,
        value: String(e.weight),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  const mc03 = treeMinCut(tree, 0, 3);
  rec
    .begin({ zh: `查询 mincut(0,3) = ${mc03}`, en: `Query mincut(0,3) = ${mc03}` })
    .setGraph(nodes, treeEdges)
    .setAux([{ label: 'mincut(0,3)', value: String(mc03), role: 'pivot' as BarRole }])
    .commit();
  return rec.build();
}
