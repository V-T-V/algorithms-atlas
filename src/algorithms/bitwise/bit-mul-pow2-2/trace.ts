import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mulPow2 } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [3, 4],
  [1, 8],
  [-1, 2],
  [5, 0],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2的幂乘法', en: 'Multiply by power of two' }).commit();
  for (const [x, k] of input) {
    const r = mulPow2(x, k, {
      onShift: (n) =>
        rec
          .begin({ zh: '<< ' + n, en: '<< ' + n })
          .setAux([{ label: 'shift', value: String(n), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: x + ' * 2^' + k + ' = ' + r, en: x + ' * 2^' + k + ' = ' + r })
      .setAux([{ label: 'mul', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
