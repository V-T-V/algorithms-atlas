import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctwPredict } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bits = [0, 1, 0, 1, 0, 1, 1, 0, 0, 1];
  rec
    .begin({ zh: 'CTW', en: 'CTW' })
    .setBars(bits.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ctwPredict(bits, 3, {
    onPredict: (bit, p) =>
      rec
        .begin({ zh: `bit=${bit} p=${p.toFixed(2)}`, en: '' })
        .setAux([{ label: 'prob', value: p.toFixed(2), role: 'compare' as BarRole }])
        .commit(),
  });
  return rec.build();
}
