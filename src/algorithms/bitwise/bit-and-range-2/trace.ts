import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeAnd } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [5, 7],
  [12, 15],
  [16, 19],
  [10, 10],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间按位与', en: 'Range bitwise AND' }).commit();
  for (const [m, n] of input) {
    const r = rangeAnd(m, n, {
      onShift: (s, a, c) =>
        rec
          .begin({
            zh: 'shift ' + s + ': ' + b(a) + ' / ' + b(c),
            en: 'shift ' + s + ': ' + b(a) + ' / ' + b(c),
          })
          .setAux([
            { label: 'm', value: b(a), role: 'pivot' as BarRole },
            { label: 'n', value: b(c), role: 'frontier' as BarRole },
          ])
          .commit(),
    });
    rec
      .begin({ zh: '[' + m + ',' + n + '] AND = ' + r, en: '[' + m + ',' + n + '] AND = ' + r })
      .setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
