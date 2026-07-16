import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamming } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [1, 4],
  [7, 10],
  [0, 0],
  [255, 0],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '汉明距离', en: 'Hamming distance' }).commit();
  for (const [a, c] of input) {
    const r = hamming(a, c, {
      onXor: (d) =>
        rec
          .begin({ zh: 'xor = ' + b(d), en: 'xor = ' + b(d) })
          .setAux([{ label: 'xor', value: b(d), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: 'hamming(' + a + ',' + c + ')=' + r, en: 'hamming(' + a + ',' + c + ')=' + r })
      .setAux([{ label: 'dist', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
