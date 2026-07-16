import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xorSwap } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [10, 25],
  [0, 7],
  [-3, 8],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异或交换', en: 'XOR swap' }).commit();
  for (const [a0, b0] of input) {
    const [a, b] = xorSwap(a0, b0, {
      onStep: (s, x, y) =>
        rec
          .begin({
            zh: 'step ' + s + ': a=' + x + ' b=' + y,
            en: 'step ' + s + ': a=' + x + ' b=' + y,
          })
          .setAux([
            { label: 'a', value: String(x), role: 'pivot' as BarRole },
            { label: 'b', value: String(y), role: 'frontier' as BarRole },
          ])
          .commit(),
    });
    rec
      .begin({
        zh: '(' + a0 + ',' + b0 + ') → (' + a + ',' + b + ')',
        en: '(' + a0 + ',' + b0 + ') → (' + a + ',' + b + ')',
      })
      .setAux([{ label: '结果', value: a + ',' + b, role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
