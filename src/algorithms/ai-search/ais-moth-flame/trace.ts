import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mothFlame } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'MFO sphere 2D', en: 'MFO sphere 2D' })
    .setBars(
      Array.from({ length: 8 }, (_, i) => ({
        value: 8 - i * 0.7,
        role: 'default' as BarRole,
        label: 'm' + i,
      })),
    )
    .commit();
  mothFlame(2, 8, 30, 1, 71, {
    onIter: (it, bf, fn) =>
      rec
        .begin({
          zh: `iter ${it} best=${bf.toFixed(3)} flame=${fn}`,
          en: `iter ${it} best=${bf.toFixed(3)} flame=${fn}`,
        })
        .setBars(
          Array.from({ length: 8 }, () => ({
            value: Math.round(bf * 100) / 100,
            role: 'swap' as BarRole,
          })),
        )
        .setAux([
          { label: 'best', value: bf.toFixed(3), role: 'final' as BarRole },
          { label: 'flame', value: String(fn), role: 'compare' as BarRole },
        ])
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
