// 多汇最大流 · 录制帧序列
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiSinkMaxFlow, type MultiSinkInput } from './impl.ts';

export const DEFAULT_INPUT: MultiSinkInput = {
  nodes: ['S', 'A', 'B', 'C'],
  edges: [
    { from: 'S', to: 'A', capacity: 6 },
    { from: 'S', to: 'B', capacity: 4 },
    { from: 'A', to: 'C', capacity: 5 },
    { from: 'B', to: 'C', capacity: 3 },
  ],
  source: 'S',
  sinks: [
    { id: 'A', demand: 8 },
    { id: 'C', demand: 8 },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  S: { x: 0.08, y: 0.5 },
  A: { x: 0.38, y: 0.25 },
  B: { x: 0.38, y: 0.75 },
  C: { x: 0.66, y: 0.5 },
  __SUPER_SNK__: { x: 0.94, y: 0.5 },
};

export function buildTrace(input: MultiSinkInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = multiSinkMaxFlow(input);
  const nodes: GraphNode[] = [...input.nodes, '__SUPER_SNK__'].map((id) => {
    const role: BarRole =
      id === input.source ? 'pivot' : input.sinks.some((s) => s.id === id) ? 'final' : 'default';
    return {
      id,
      label: id === '__SUPER_SNK__' ? 'T*' : id,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role,
    };
  });
  const allEdges = [
    ...input.edges,
    ...input.sinks.map((t) => ({ from: t.id, to: '__SUPER_SNK__', capacity: t.demand })),
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
      zh: `多汇网络：源 ${input.source}，汇 ${input.sinks.map((s) => s.id).join(',')}`,
      en: `Multi-sink: source ${input.source}, sinks ${input.sinks.map((s) => s.id).join(',')}`,
    })
    .setGraph(nodes, edges)
    .setAux(aux)
    .commit();

  rec
    .begin({
      zh: `加超级汇 T*，最大流 = ${result.maxFlow}`,
      en: `Add super-sink T*, max flow = ${result.maxFlow}`,
    })
    .setGraph(nodes, edges)
    .setAux(aux)
    .commit();
  return rec.build();
}
