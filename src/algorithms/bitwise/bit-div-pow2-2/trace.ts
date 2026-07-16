import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { divPow2 } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [100, 3],
  [-100, 3],
  [7, 1],
  [-8, 2],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂除法', en: 'Divide by power of two' }).commit();
  for (const [x, k] of input) {
    const r = divPow2(x, k, {
      onShift: (kk, biased) =>
        rec
          .begin({ zh: 'biased=' + biased + ' >> ' + kk, en: 'biased=' + biased + ' >> ' + kk })
          .setAux([{ label: 'biased', value: String(biased), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: x + ' / 2^' + k + ' = ' + r, en: x + ' / 2^' + k + ' = ' + r })
      .setAux([{ label: 'div', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
