// 节点容量最大流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nodeCapMaxFlow, type NodeCapInput } from './impl.ts';

export const DEFAULT_INPUT: NodeCapInput = {
  nodes: [
    { id: 'S', capacity: 10 },
    { id: 'A', capacity: 2 },
    { id: 'B', capacity: 10 },
    { id: 'T', capacity: 10 },
  ],
  edges: [
    { from: 'S', to: 'A', capacity: 5 },
    { from: 'S', to: 'B', capacity: 5 },
    { from: 'A', to: 'T', capacity: 5 },
    { from: 'B', to: 'T', capacity: 5 },
  ],
  source: 'S',
  sink: 'T',
};

export function buildTrace(input: NodeCapInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = nodeCapMaxFlow(input);
  const ids = input.nodes.map((n) => n.id);
  const POS: Record<string, { x: number; y: number }> = {
    S: { x: 0.1, y: 0.5 },
    A: { x: 0.4, y: 0.25 },
    B: { x: 0.4, y: 0.75 },
    T: { x: 0.9, y: 0.5 },
  };
  const nodes: GraphNode[] = ids.map((id) => ({
    id,
    label: `${id} (cap ${input.nodes.find((n) => n.id === id)!.capacity})`,
    x: POS[id]?.x ?? 0.5,
    y: POS[id]?.y ?? 0.5,
    role: (id === input.source ? 'pivot' : id === input.sink ? 'final' : 'default') as BarRole,
  }));
  const edges: GraphEdge[] = input.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.capacity,
    directed: true,
    role: 'default' as BarRole,
  }));
  const aux = input.edges.map((e) => ({
    label: `${e.from}→${e.to}`,
    value: `0/${e.capacity}`,
    role: 'default' as BarRole,
  }));

  rec
    .begin({
      zh: `节点容量网络：分裂后求最大流`,
      en: `Node-capacitated network: split then max-flow`,
    })
    .setGraph(nodes, edges)
    .setAux(aux)
    .commit();

  rec
    .begin({
      zh: `节点 A 限流 2 → 最大流 = ${result.maxFlow}`,
      en: `Node A caps at 2 → max flow = ${result.maxFlow}`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: 'max flow', value: String(result.maxFlow), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
