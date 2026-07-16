import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, insertionSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '链表插入排序', en: 'Insertion sort' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = insertionSortList(head, {
    onInsert: (v) =>
      rec
        .begin({ zh: '插入 ' + v, en: 'insert ' + v })
        .setAux([{ label: 'insert', value: String(v), role: 'pivot' as BarRole }])
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
