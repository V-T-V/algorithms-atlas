import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pso } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'PSO sphere 2D', en: 'PSO sphere 2D' })
    .setBars(
      Array.from({ length: 10 }, (_, i) => ({
        value: 5 - i * 0.4,
        role: 'default' as BarRole,
        label: 'p' + i,
      })),
    )
    .commit();
  let lastIter = -1;
  pso(2, 10, 30, 0.7, 1.5, 1.5, 11, {
    onIter: (it, _gb, gf) => {
      lastIter = it;
      rec
        .begin({ zh: `iter ${it} gfit=${gf.toFixed(3)}`, en: `iter ${it} gfit=${gf.toFixed(3)}` })
        .setBars(
          Array.from({ length: 10 }, () => ({
            value: Math.round(gf * 100) / 100,
            role: 'swap' as BarRole,
          })),
        )
        .setAux([{ label: 'gfit', value: gf.toFixed(3), role: 'final' as BarRole }])
        .commit();
    },
    onDone: (gb, gf) =>
      rec
        .begin({ zh: `完成 gfit=${gf.toFixed(3)}`, en: `done gfit=${gf.toFixed(3)}` })
        .setAux([
          {
            label: 'best',
            value: JSON.stringify(gb.map((v) => Math.round(v * 100) / 100)),
            role: 'final' as BarRole,
          },
        ])
        .commit(),
  });
  void lastIter;
  return rec.build();
}
