// =============================================================================
// 拓扑排序 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topologicalSort, type DagGraphInput, type TopoHooks } from './impl.ts';

export const DEFAULT_INPUT: DagGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.3, y: 0.2 },
  C: { x: 0.3, y: 0.8 },
  D: { x: 0.6, y: 0.5 },
  E: { x: 0.85, y: 0.5 },
};

export function buildTrace(input: DagGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const removed = new Set<string>();
  const order: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (removed.has(id) ? 'final' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          directed: true,
          role: (removed.has(e.from) ? 'final' : 'default') as BarRole,
        })),
      )
      .setAux([{ label: 'Order', value: order.length ? order.join('→') : '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: 'Kahn 拓扑排序', en: 'Kahn topo sort' });

  const hooks: TopoHooks = {
    onPick: (u) => {
      removed.add(u);
      order.push(u);
      render({ zh: `取出 ${u}`, en: `Pick ${u}` });
    },
  };

  const r = topologicalSort(input, hooks);

  rec
    .begin({
      zh: `拓扑序=${r.order.join('→')} 有环=${r.hasCycle}`,
      en: `Order=${r.order.join('->')} cycle=${r.hasCycle}`,
    })
    .setAux([{ label: '拓扑序', value: r.order.join(' '), role: 'final' }])
    .commit();

  return rec.build();
}
