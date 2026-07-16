import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeXor } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [3, 5],
  [0, 7],
  [10, 15],
  [4, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间异或', en: 'Range XOR' }).commit();
  for (const [m, n] of input) {
    const r = rangeXor(m, n, {
      onPrefix: (nn, val) =>
        rec
          .begin({ zh: 'f(' + nn + ')=' + val, en: 'f(' + nn + ')=' + val })
          .setAux([{ label: 'f(n)', value: String(val), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: '[' + m + ',' + n + '] XOR = ' + r, en: '[' + m + ',' + n + '] XOR = ' + r })
      .setAux([{ label: '结果', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
