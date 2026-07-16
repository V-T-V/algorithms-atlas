import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gsa } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'GSA sphere 2D', en: 'GSA sphere 2D' })
    .setBars(
      Array.from({ length: 8 }, (_, i) => ({
        value: 30 - i * 2,
        role: 'default' as BarRole,
        label: 'p' + i,
      })),
    )
    .commit();
  gsa(2, 8, 30, 100, 41, {
    onIter: (it, bf) =>
      rec
        .begin({ zh: `iter ${it} best=${bf.toFixed(3)}`, en: `iter ${it} best=${bf.toFixed(3)}` })
        .setBars(
          Array.from({ length: 8 }, () => ({
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
