import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delta2Encode } from './impl.ts';
export const DEFAULT_INPUT = [100, 105, 111, 118, 126];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二阶差分', en: '2nd-order delta' }).commit();
  const { d1, d2 } = delta2Encode(input, {
    onEmit: (i, v) =>
      rec
        .begin({ zh: 'i' + i + ' d2=' + v, en: 'd2' })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' as BarRole },
          { label: 'd2', value: String(v), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'd1[' + d1.join(',') + '] d2[' + d2.join(',') + ']', en: 'result' })
    .setAux([{ label: 'd2', value: d2.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
