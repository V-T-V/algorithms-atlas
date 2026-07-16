import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeOr } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [5, 7],
  [8, 11],
  [16, 23],
  [9, 9],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间按位或', en: 'Range bitwise OR' }).commit();
  for (const [m, n] of input) {
    const r = rangeOr(m, n, {
      onFill: (val) =>
        rec
          .begin({ zh: 'fill = ' + b(val), en: 'fill = ' + b(val) })
          .setAux([{ label: 'val', value: b(val), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '[' + m + ',' + n + '] OR = ' + r, en: '[' + m + ',' + n + '] OR = ' + r })
      .setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
