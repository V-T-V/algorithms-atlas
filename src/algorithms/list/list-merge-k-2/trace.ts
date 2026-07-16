import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeKLists } from './impl.ts';
export const DEFAULT_INPUT = [
  [1, 4, 5],
  [1, 3, 4],
  [2, 6],
];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const lists = input.map(buildList);
  rec
    .begin({ zh: '合并 ' + input.length + ' 个链表', en: 'Merge ' + input.length + ' lists' })
    .commit();
  const h = mergeKLists(lists, {
    onMerge: (a, b) =>
      rec
        .begin({ zh: '合并 ' + a + ' 与 ' + b, en: 'merge ' + a + ' & ' + b })
        .setAux([{ label: 'merge', value: a + ',' + b, role: 'pivot' as BarRole }])
        .commit(),
  });
  const arr = listToArray(h);
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
