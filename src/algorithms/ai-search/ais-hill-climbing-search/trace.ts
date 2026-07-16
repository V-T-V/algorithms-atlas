import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hillClimb, landscape } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const samples = Array.from({ length: 21 }, (_, i) => landscape(i));
  rec
    .begin({ zh: '地形', en: 'landscape' })
    .setBars(samples.map((v) => ({ value: Math.round(v * 10) / 10, role: 'default' as BarRole })))
    .commit();
  hillClimb(2, 1, 0, 20, 50, {
    onStep: (pos, val) => {
      const bars = samples.map((v, i) => ({
        value: Math.round(v * 10) / 10,
        role: (i === pos ? 'final' : 'default') as BarRole,
        label: String(i),
      }));
      rec
        .begin({ zh: `到达 x=${pos} f=${val.toFixed(2)}`, en: `at x=${pos} f=${val.toFixed(2)}` })
        .setBars(bars)
        .setAux([{ label: 'x', value: String(pos), role: 'swap' as BarRole }])
        .commit();
    },
    onStuck: (pos) =>
      rec
        .begin({ zh: `局部最优 x=${pos}`, en: `local opt x=${pos}` })
        .setAux([{ label: 'STUCK', value: String(pos), role: 'warn' as BarRole }])
        .commit(),
  });
  return rec.build();
}
