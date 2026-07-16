import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { highestSetBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [1, 5, 16, 255, 1000, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最高位1', en: 'Highest set bit' }).commit();
  for (const x of input) {
    const r = highestSetBit(x, {
      onFill: (f) =>
        rec
          .begin({ zh: 'filled = ' + b(f), en: 'filled = ' + b(f) })
          .setAux([{ label: 'filled', value: b(f), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'MSB(' + x + ')=' + b(r), en: 'MSB(' + x + ')=' + b(r) })
      .setAux([{ label: 'msb', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
