// =============================================================================
// DAG 最短路 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dagShortestPath, type DagGraphInput, type DagSpHooks } from './impl.ts';

export const DEFAULT_INPUT: DagGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 6 },
    { from: 'B', to: 'C', weight: 3 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'D', to: 'E', weight: 4 },
  ],
};

export const DEFAULT_START = 'A';

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.3, y: 0.25 },
  C: { x: 0.5, y: 0.75 },
  D: { x: 0.7, y: 0.4 },
  E: { x: 0.9, y: 0.5 },
};

export function buildTrace(input: DagGraphInput = DEFAULT_INPUT, start = DEFAULT_START): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  for (const n of input.nodes) dist.set(n, Infinity);
  dist.set(start, 0);
  let exam: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: `${id}:${Number.isFinite(dist.get(id) ?? Infinity) ? dist.get(id) : '∞'}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: 'default' as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          weight: e.weight,
          directed: true,
          role: (exam && exam.from === e.from && exam.to === e.to
            ? 'compare'
            : 'default') as BarRole,
        })),
      )
      .commit();
  };

  render({ zh: `从 ${start} 出发`, en: `Start from ${start}` });

  const hooks: DagSpHooks = {
    onTopo: (o) => {
      render({ zh: `拓扑序：${o.join('→')}`, en: `Topo: ${o.join('->')}` });
    },
    onRelax: (from, to, nd) => {
      dist.set(to, nd);
      exam = { from, to };
      render({ zh: `${from}→${to} dist=${nd}`, en: `${from}->${to} dist=${nd}` });
      exam = null;
    },
  };

  const r = dagShortestPath(input, start, hooks);
  void r;

  rec
    .begin({ zh: 'DAG 最短路完成', en: 'DAG SP done' })
    .setAux(
      input.nodes.map((id) => ({
        label: `dist[${id}]`,
        value: Number.isFinite(dist.get(id) ?? Infinity) ? String(dist.get(id)) : '∞',
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
