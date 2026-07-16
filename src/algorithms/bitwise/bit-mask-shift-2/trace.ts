import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lowMask } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [0, 1, 4, 8, 16, 32];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '低k位掩码', en: 'Low-k mask' }).commit();
  for (const k of input) {
    const r = lowMask(k, {
      onResult: (m) =>
        rec
          .begin({ zh: 'mask(' + k + ')=' + b(m), en: 'mask(' + k + ')=' + b(m) })
          .setAux([{ label: 'mask', value: b(m), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'k=' + k + ' → ' + b(r), en: 'k=' + k + ' → ' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
