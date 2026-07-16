// Dijkstra · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDijkstra3 } from './impl.ts';
const G: ReadonlyArray<readonly number[]> = [
  [0, 4, 1, 0],
  [4, 0, 2, 5],
  [1, 2, 0, 3],
  [0, 5, 3, 0],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Dijkstra：源 0', en: 'Dijkstra: source 0' }).commit();
  const dist: number[] = new Array(G.length).fill(Infinity);
  dist[0] = 0;
  const r = greedyDijkstra3(G, 0, {
    onRelax: (_u, v, nd) => {
      dist[v] = nd;
      rec
        .begin({ zh: `松弛 ${_u}->${v}：dist=${nd}`, en: `Relax ${_u}->${v}: dist=${nd}` })
        .setBars(
          dist.map((x, i) => ({
            value: x === Infinity ? 0 : x,
            role: 'compare' as BarRole,
            label: `d${i}`,
          })),
        )
        .commit();
    },
  });
  rec
    .begin({ zh: '最终 dist', en: 'Final dist' })
    .setBars(r.dist.map((x) => ({ value: x === Infinity ? 0 : x, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
