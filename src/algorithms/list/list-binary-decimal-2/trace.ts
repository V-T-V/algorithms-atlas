import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, binaryToDecimal } from './impl.ts';
export const DEFAULT_INPUT = [1, 0, 1, 0]; // 10
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '二进制 → 十进制', en: 'Binary to decimal' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const v = binaryToDecimal(head, {
    onStep: (bit, acc) =>
      rec
        .begin({ zh: 'bit=' + bit + ' → ' + acc, en: 'bit=' + bit + ' → ' + acc })
        .setAux([{ label: 'acc', value: String(acc), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '十进制 = ' + v, en: 'decimal = ' + v })
    .setAux([{ label: 'value', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
