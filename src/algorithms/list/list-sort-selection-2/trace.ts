import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, selectionSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '选择排序', en: 'Selection sort' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  selectionSortList(head, {
    onSwap: (a, b) =>
      rec
        .begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b })
        .setArray(
          listToArray(head),
          listToArray(head).map(() => 'default' as BarRole),
          [],
        )
        .commit(),
  });
  const arr = listToArray(head);
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
