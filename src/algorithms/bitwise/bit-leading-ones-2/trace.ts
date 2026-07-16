import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countLeadingOnes } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b11100000, 0xffffffff, 0b01110000 >>> 0, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前导连续1', en: 'Leading ones' }).commit();
  for (const x of input) {
    const r = countLeadingOnes(x, {
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
