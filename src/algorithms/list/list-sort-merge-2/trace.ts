import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeSortList } from './impl.ts';
export const DEFAULT_INPUT = [4, 2, 1, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '链表归并排序', en: 'Merge sort list' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = mergeSortList(head, {
    onMerge: (a, b) =>
      rec
        .begin({ zh: '合并 ' + a + ' 与 ' + b, en: 'merge ' + a + ' & ' + b })
        .setAux([{ label: 'merge', value: a + ',' + b, role: 'pivot' as BarRole }])
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
