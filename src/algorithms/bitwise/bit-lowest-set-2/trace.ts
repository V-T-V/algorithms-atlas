import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lowestSetBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b10100, 0b10000, 0b11, 1, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最低位1', en: 'Lowest set bit' }).commit();
  for (const x of input) {
    const r = lowestSetBit(x, {
      onResult: (v) =>
        rec
          .begin({ zh: b(x) + ' & -x = ' + b(v), en: b(x) + ' & -x = ' + b(v) })
          .setAux([{ label: 'lsb', value: b(v), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'LSB=' + b(r), en: 'LSB=' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
