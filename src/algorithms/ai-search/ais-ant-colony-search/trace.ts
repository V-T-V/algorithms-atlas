import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aco } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [
    [0, 2, 5, 8],
    [2, 0, 4, 3],
    [5, 4, 0, 6],
    [8, 3, 6, 0],
  ];
  rec
    .begin({ zh: '4 城 TSP', en: '4-city TSP' })
    .setAux([{ label: '城市', value: '4', role: 'compare' as BarRole }])
    .commit();
  aco(D, 5, 25, 1, 3, 0.3, 13, {
    onImprove: (L, tour) =>
      rec
        .begin({ zh: `改进 L=${L.toFixed(2)}`, en: `improve L=${L.toFixed(2)}` })
        .setAux([
          { label: 'tour', value: tour.join('→'), role: 'swap' as BarRole },
          { label: 'L', value: L.toFixed(2), role: 'final' as BarRole },
        ])
        .commit(),
    onDone: (L, tour) =>
      rec
        .begin({ zh: `完成 L=${L.toFixed(2)}`, en: `done L=${L.toFixed(2)}` })
        .setAux([{ label: 'best', value: tour.join('→'), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
