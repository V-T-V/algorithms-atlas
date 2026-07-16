import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countTrailingOnes } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b1011, 0b111, 0b1000, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '末尾连续1', en: 'Trailing ones' }).commit();
  for (const x of input) {
    const r = countTrailingOnes(x, {
      onResult: (c) =>
        rec
          .begin({ zh: b(x) + ' → ' + c, en: b(x) + ' → ' + c })
          .setAux([{ label: 'ones', value: String(c), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'result=' + r, en: 'result=' + r })
      .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
