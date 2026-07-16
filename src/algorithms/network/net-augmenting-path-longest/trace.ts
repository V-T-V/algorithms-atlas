// 最大瓶颈增广路 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { widestAugmentingPath, type WidestEdge, type WidestHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  nodes: ['S', 'A', 'B', 'C', 'T'],
  edges: [
    { from: 'S', to: 'A', cap: 10 },
    { from: 'S', to: 'B', cap: 10 },
    { from: 'A', to: 'B', cap: 2 },
    { from: 'A', to: 'C', cap: 4 },
    { from: 'A', to: 'T', cap: 8 },
    { from: 'B', to: 'C', cap: 9 },
    { from: 'C', to: 'T', cap: 10 },
  ] as WidestEdge[],
  source: 'S',
  sink: 'T',
};

const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.35, y: 0.2 },
  B: { x: 0.35, y: 0.8 },
  C: { x: 0.65, y: 0.5 },
  T: { x: 0.9, y: 0.5 },
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const mkNodes = (role: BarRole): GraphNode[] =>
    input.nodes.map((id) => ({
      id,
      label: id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (id === input.source ? 'pivot' : id === input.sink ? 'final' : role) as BarRole,
    }));
  const mkEdges = (): GraphEdge[] =>
    input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      weight: e.cap,
      directed: true,
      role: 'frontier' as BarRole,
    }));

  rec
    .begin({ zh: `初始网络`, en: `Initial network` })
    .setGraph(mkNodes('default'), mkEdges())
    .commit();

  const hooks: WidestHooks = {
    onAugment: (path, bottleneck, total) => {
      rec
        .begin({
          zh: `最大瓶颈路 ${path.join('→')} × ${bottleneck}，累计 ${total}`,
          en: `Widest path ${path.join('→')} × ${bottleneck}, total ${total}`,
        })
        .setGraph(mkNodes('compare'), mkEdges())
        .setAux([
          { label: 'widest', value: `${path.join('→')}=${bottleneck}`, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const maxFlow = widestAugmentingPath(input.nodes, input.edges, input.source, input.sink, hooks);

  rec
    .begin({ zh: `完成，最大流 = ${maxFlow}`, en: `Done, max flow = ${maxFlow}` })
    .setGraph(mkNodes('final'), mkEdges())
    .setAux([{ label: 'max', value: String(maxFlow), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
