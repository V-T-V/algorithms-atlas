// 无向图最大流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { undirectedMaxFlow, type UndirectedFlowInput } from './impl.ts';

export const DEFAULT_INPUT: UndirectedFlowInput = {
  nodes: ['S', 'A', 'B', 'T'],
  edges: [
    { from: 'S', to: 'A', capacity: 3 },
    { from: 'S', to: 'B', capacity: 2 },
    { from: 'A', to: 'B', capacity: 4 },
    { from: 'A', to: 'T', capacity: 2 },
    { from: 'B', to: 'T', capacity: 3 },
  ],
  source: 'S',
  sink: 'T',
};

const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.1, y: 0.5 },
  A: { x: 0.4, y: 0.25 },
  B: { x: 0.4, y: 0.75 },
  T: { x: 0.9, y: 0.5 },
};

export function buildTrace(input: UndirectedFlowInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = undirectedMaxFlow(input);
  const nodes: GraphNode[] = input.nodes.map((id) => ({
    id,
    label: id,
    x: POS[id]?.x ?? 0.5,
    y: POS[id]?.y ?? 0.5,
    role: (id === input.source ? 'pivot' : id === input.sink ? 'final' : 'default') as BarRole,
  }));
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.capacity,
    directed: false,
    role: 'default' as BarRole,
  }));

  rec
    .begin({ zh: `无向网络：每条边双向`, en: `Undirected network: bidirectional edges` })
    .setGraph(nodes, edges)
    .commit();

  rec
    .begin({ zh: `最大流 = ${result.maxFlow}`, en: `Max flow = ${result.maxFlow}` })
    .setGraph(nodes, edges)
    .setAux([{ label: 'max flow', value: String(result.maxFlow), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
