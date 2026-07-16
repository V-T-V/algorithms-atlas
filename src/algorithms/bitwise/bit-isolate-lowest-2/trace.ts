import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isolateLowestBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT = [0b00110010, 0b10000000, 0b00010001, 0];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '提取最低位1', en: 'Isolate lowest set bit' }).commit();
  for (const x of input) {
    const r = isolateLowestBit(x, {
      onIsolate: (iso) =>
        rec
          .begin({ zh: b(x) + ' & -' + x + ' = ' + b(iso), en: b(x) + ' & -x = ' + b(iso) })
          .setAux([{ label: 'lowbit', value: b(iso), role: 'final' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'lowbit = ' + b(r), en: 'lowbit = ' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
