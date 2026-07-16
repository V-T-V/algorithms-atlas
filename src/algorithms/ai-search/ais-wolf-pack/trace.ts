import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wolfPack } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'WolfPack Rastrigin 2D', en: 'WolfPack Rastrigin 2D' })
    .setBars(
      Array.from({ length: 8 }, (_, i) => ({
        value: 30 - i * 2,
        role: 'default' as BarRole,
        label: 'w' + i,
      })),
    )
    .commit();
  wolfPack(2, 8, 30, 1.5, 0.3, 31, {
    onIter: (it, bf) =>
      rec
        .begin({ zh: `iter ${it} best=${bf.toFixed(2)}`, en: `iter ${it} best=${bf.toFixed(2)}` })
        .setBars(
          Array.from({ length: 8 }, () => ({
            value: Math.round(bf * 10) / 10,
            role: 'swap' as BarRole,
          })),
        )
        .setAux([{ label: 'best', value: bf.toFixed(2), role: 'final' as BarRole }])
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
