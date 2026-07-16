import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clearLowestBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b00110010, 0b10000000, 0b00010001, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '清除最低位1', en: 'Clear lowest set bit' }).commit();
  for (const x of input) {
    const r = clearLowestBit(x, {
      onCleared: (before, after) =>
        rec
          .begin({
            zh: b(before) + ' & ' + b(before - 1) + ' = ' + b(after),
            en: b(before) + ' & (b-1) = ' + b(after),
          })
          .setAux([{ label: 'after', value: b(after), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '结果 = ' + b(r), en: 'result = ' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
