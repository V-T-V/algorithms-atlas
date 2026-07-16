import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulatedAnneal, energy } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const samples = Array.from({ length: 15 }, (_, i) => energy(i));
  rec
    .begin({ zh: '能量地形', en: 'energy landscape' })
    .setBars(samples.map((v) => ({ value: Math.round(v * 10) / 10, role: 'default' as BarRole })))
    .commit();
  simulatedAnneal(2, 0, 14, 10, 0.1, 40, 7, {
    onImprove: (x, v) => {
      const bars = samples.map((s, i) => ({
        value: Math.round(s * 10) / 10,
        role: (i === x ? 'final' : 'default') as BarRole,
        label: String(i),
      }));
      rec
        .begin({ zh: `改进 x=${x} v=${v.toFixed(2)}`, en: `improve x=${x} v=${v.toFixed(2)}` })
        .setBars(bars)
        .setAux([{ label: 'best', value: String(x), role: 'swap' as BarRole }])
        .commit();
    },
    onDone: (x) =>
      rec
        .begin({ zh: `完成 x=${x}`, en: `done x=${x}` })
        .setAux([{ label: 'final', value: String(x), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
