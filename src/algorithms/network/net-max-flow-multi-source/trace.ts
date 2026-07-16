// 多源最大流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiSourceMaxFlow, type MultiSourceInput } from './impl.ts';

export const DEFAULT_INPUT: MultiSourceInput = {
  nodes: ['A', 'B', 'C', 'T'],
  edges: [
    { from: 'A', to: 'C', capacity: 5 },
    { from: 'B', to: 'C', capacity: 3 },
    { from: 'A', to: 'T', capacity: 4 },
    { from: 'C', to: 'T', capacity: 6 },
  ],
  sources: [
    { id: 'A', supply: 6 },
    { id: 'B', supply: 4 },
  ],
  sink: 'T',
};

const POS: Record<string, { x: number; y: number }> = {
  __SUPER_SRC__: { x: 0.05, y: 0.5 },
  A: { x: 0.32, y: 0.25 },
  B: { x: 0.32, y: 0.75 },
  C: { x: 0.62, y: 0.5 },
  T: { x: 0.92, y: 0.5 },
};

export function buildTrace(input: MultiSourceInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = multiSourceMaxFlow(input);
  const nodes: GraphNode[] = [...input.nodes, '__SUPER_SRC__'].map((id) => {
    const role: BarRole = input.sources.some((s) => s.id === id)
      ? 'pivot'
      : id === input.sink
        ? 'final'
        : 'default';
    return {
      id,
      label: id === '__SUPER_SRC__' ? 'S*' : id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role,
    };
  });
  const allEdges = [
    ...input.edges,
    ...input.sources.map((s) => ({ from: '__SUPER_SRC__', to: s.id, capacity: s.supply })),
  ];
  const edges: GraphEdge[] = allEdges.map((e) => {
    const fe = result.flows.find((f) => f.from === e.from && f.to === e.to);
    const f = fe ? fe.flow : 0;
    return {
      from: e.from,
      to: e.to,
      weight: e.capacity,
      directed: true,
      role: (f > 0 ? 'frontier' : 'default') as BarRole,
    };
  });
  const aux = allEdges.map((e) => {
    const fe = result.flows.find((f) => f.from === e.from && f.to === e.to);
    const f = fe ? fe.flow : 0;
    return {
      label: `${e.from}→${e.to}`,
      value: `${f}/${e.capacity}`,
      role: (f > 0 ? 'frontier' : 'default') as BarRole,
    };
  });

  rec
    .begin({
      zh: `多源网络：源 ${input.sources.map((s) => s.id).join(',')}，汇 ${input.sink}`,
      en: `Multi-source: sources ${input.sources.map((s) => s.id).join(',')}, sink ${input.sink}`,
    })
    .setGraph(nodes, edges)
    .setAux(aux)
    .commit();

  rec
    .begin({
      zh: `加超级源 S*，最大流 = ${result.maxFlow}`,
      en: `Add super-source S*, max flow = ${result.maxFlow}`,
    })
    .setGraph(nodes, edges)
    .setAux(aux)
    .commit();
  return rec.build();
}
