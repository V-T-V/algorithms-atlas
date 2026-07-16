import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { differentialEvolution } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'DE sphere 2D', en: 'DE sphere 2D' })
    .setBars(
      Array.from({ length: 10 }, (_, i) => ({
        value: 10 - i,
        role: 'default' as BarRole,
        label: 'p' + i,
      })),
    )
    .commit();
  differentialEvolution(2, 10, 30, 0.7, 0.9, -5, 5, 59, {
    onIter: (it, bf) =>
      rec
        .begin({ zh: `iter ${it} best=${bf.toFixed(3)}`, en: `iter ${it} best=${bf.toFixed(3)}` })
        .setBars(
          Array.from({ length: 10 }, () => ({
            value: Math.round(bf * 100) / 100,
            role: 'swap' as BarRole,
          })),
        )
        .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }])
        .commit(),
    onDone: (bf, b) =>
      rec
        .begin({ zh: '完成', en: 'done' })
        .setAux([
          {
            label: 'pos',
            value: JSON.stringify(b.map((v) => Math.round(v * 100) / 100)),
            role: 'final' as BarRole,
          },
        ])
        .commit(),
  });
  return rec.build();
}
