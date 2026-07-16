import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '反转', en: 'Reverse' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = reverseList(head, {
    onFlip: (v) =>
      rec
        .begin({ zh: '翻转 ' + v, en: 'flip ' + v })
        .setArray(
          [...input],
          input.map(() => 'default' as BarRole),
          [],
        )
        .commit(),
  });
  const arr = listToArray(nh);
  rec
    .begin({ zh: '结果：' + arr.join(' → '), en: 'Result: ' + arr.join(' → ') })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .commit();
  return rec.build();
}
