// Dijkstra · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dijkstraGreedy, type Edge, type DijkstraGreedyHooks } from './impl.ts';

export interface DjInput {
  graph: Edge[][];
  source: number;
}

export const DEFAULT_INPUT: DjInput = {
  graph: [
    [
      { to: 1, weight: 4 },
      { to: 2, weight: 1 },
    ],
    [{ to: 3, weight: 1 }],
    [
      { to: 1, weight: 2 },
      { to: 3, weight: 5 },
    ],
    [],
  ],
  source: 0,
};

/** 录制演示帧序列。 */
export function buildTrace(input: DjInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { graph, source } = input;
  const dist = new Array<number>(graph.length).fill(Infinity);
  dist[source] = 0;

  rec
    .begin({ zh: `源点 ${source}，dist=[0,∞,...]`, en: `Source ${source}, dist=[0,inf,...]` })
    .setBars(dist.map((d) => ({ value: d === Infinity ? 999 : d, role: 'pivot' as BarRole })))
    .commit();

  const hooks: DijkstraGreedyHooks = {
    onRelax: (_u, v, nd) => {
      dist[v] = nd;
      rec
        .begin({ zh: `松弛边到 ${v}，dist=${nd}`, en: `Relax edge to ${v}, dist=${nd}` })
        .setBars(
          dist.map((d, i) => ({
            value: d === Infinity ? 999 : d,
            role: (i === v ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit();
    },
    onSettle: (u) => {
      rec
        .begin({ zh: `确定点 ${u}（dist=${dist[u]}）`, en: `Settle ${u} (dist=${dist[u]})` })
        .setBars(
          dist.map((d, i) => ({
            value: d === Infinity ? 999 : d,
            role: (i === u ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };
  const { dist: final } = dijkstraGreedy(graph, source, hooks);

  rec
    .begin({ zh: `完成：dist=[${final.join(',')}]`, en: `Done: dist=[${final.join(',')}]` })
    .setBars(final.map((d) => ({ value: d === Infinity ? 999 : d, role: 'final' as BarRole })))
    .setMap(
      final.map((d, i) => ({
        key: `d[${i}]`,
        value: d === Infinity ? '∞' : String(d),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
