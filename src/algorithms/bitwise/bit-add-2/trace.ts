import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [13, 22],
  [0, 7],
  [255, 1],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位运算加法', en: 'Bit addition' }).commit();
  for (const [a, c] of input) {
    const r = addBit(a, c, {
      onIter: (i, x, y) =>
        rec
          .begin({
            zh: '迭代' + i + ': sum=' + b(x) + ' carry=' + b(y),
            en: 'iter ' + i + ': sum=' + b(x) + ' carry=' + b(y),
          })
          .setAux([
            { label: 'sum', value: b(x), role: 'pivot' as BarRole },
            { label: 'carry', value: b(y), role: 'frontier' as BarRole },
          ])
          .commit(),
    });
    rec
      .begin({ zh: a + ' + ' + c + ' = ' + r, en: a + ' + ' + c + ' = ' + r })
      .setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
