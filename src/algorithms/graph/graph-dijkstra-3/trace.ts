// =============================================================================
// Dijkstra · 录制
import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstra, reconstructPath, type DijkstraHooks, type WeightedGraphInput } from './impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'C', to: 'B', weight: 2 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 5 },
    { from: 'D', to: 'E', weight: 3 },
  ],
  directed: true,
};

export const DEFAULT_START = 'A';

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.1, y: 0.5 },
  B: { x: 0.35, y: 0.2 },
  C: { x: 0.35, y: 0.8 },
  D: { x: 0.65, y: 0.5 },
  E: { x: 0.9, y: 0.5 },
};

export function buildTrace(
  input: WeightedGraphInput = DEFAULT_INPUT,
  start = DEFAULT_START,
): Frame[] {
  const rec = new TraceRecorder();
  const dist = new Map<string, number>();
  const finalized = new Set<string>();
  let exam: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = input.nodes.map((id) => ({
      id,
      label: `${id}:${Number.isFinite(dist.get(id) ?? Infinity) ? dist.get(id) : '∞'}`,
      x: POS[id]?.x ?? 0.5,
      y: POS[id]?.y ?? 0.5,
      role: (finalized.has(id)
        ? 'final'
        : dist.has(id) && Number.isFinite(dist.get(id) ?? Infinity)
          ? 'frontier'
          : 'default') as BarRole,
    }));
    const edges: GraphEdge[] = input.edges.map((e) => ({
      from: e.from,
      to: e.to,
      weight: e.weight,
      directed: true,
      role: (exam && exam.from === e.from && exam.to === e.to ? 'compare' : 'default') as BarRole,
    }));
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '已确定', value: finalized.size ? [...finalized].join(',') : '∅', role: 'final' },
      ])
      .commit();
  };

  dist.set(start, 0);
  render({ zh: `从 ${start} 出发，dist[${start}]=0`, en: `Start at ${start}, dist=0` });

  const hooks: DijkstraHooks = {
    onPop: (u) => {
      render({ zh: `取出最小 ${u}（dist=${dist.get(u)}）`, en: `Pop ${u} (dist=${dist.get(u)})` });
    },
    onRelax: (from, to, _old, nd) => {
      dist.set(to, nd);
      exam = { from, to };
      render({ zh: `松弛 ${from}→${to}: dist=${nd}`, en: `Relax ${from}->${to}: dist=${nd}` });
      exam = null;
    },
  };

  const r = dijkstra(input, start, hooks);
  for (const n of input.nodes) if (Number.isFinite(r.dist.get(n) ?? Infinity)) finalized.add(n);

  const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
  for (const n of input.nodes) {
    const d = r.dist.get(n) ?? Infinity;
    aux.push({ label: `dist[${n}]`, value: Number.isFinite(d) ? String(d) : '∞', role: 'final' });
  }

  rec
    .begin({ zh: 'Dijkstra 完成', en: 'Dijkstra done' })
    .setGraph(
      input.nodes.map((id) => ({
        id,
        label: `${id}:${r.dist.get(id) ?? '∞'}`,
        x: POS[id]?.x ?? 0.5,
        y: POS[id]?.y ?? 0.5,
        role: 'final' as BarRole,
      })),
      input.edges.map((e) => ({
        from: e.from,
        to: e.to,
        weight: e.weight,
        directed: true,
        role: 'final' as BarRole,
      })),
    )
    .setAux(aux)
    .commit();

  void reconstructPath;
  return rec.build();
}
