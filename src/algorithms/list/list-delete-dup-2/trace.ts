import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteDuplicates } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2, 3, 3, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '有序去重', en: 'Remove duplicates' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = deleteDuplicates(head, {
    onDrop: (v) =>
      rec
        .begin({ zh: '删除重复 ' + v, en: 'drop dup ' + v })
        .setAux([{ label: 'dropped', value: String(v), role: 'swap' as BarRole }])
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
