import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nearestNeighborTsp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [
    [0, 2, 9, 10],
    [1, 0, 6, 4],
    [15, 7, 0, 8],
    [6, 3, 12, 0],
  ];
  rec
    .begin({ zh: '最近邻 TSP', en: 'Nearest neighbor TSP' })
    .setGraph(
      D.map((_, i) => ({ id: String(i) })),
      [],
    )
    .commit();
  const r = nearestNeighborTsp(D, 0, {
    onVisit: (f, t, d) =>
      rec
        .begin({ zh: `${f}->${t} (d=${d})`, en: `${f}->${t} (d=${d})` })
        .setBars([{ value: d, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `回路 ${r.tour.join('->')} 总长 ${r.total}`,
      en: `tour ${r.tour.join('->')} len ${r.total}`,
    })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
