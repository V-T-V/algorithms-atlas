import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteAllDuplicates } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 3, 4, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '删除所有重复', en: 'Delete all duplicates' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = deleteAllDuplicates(head, {
    onDrop: (v) =>
      rec
        .begin({ zh: '删除 ' + v, en: 'drop ' + v })
        .setAux([{ label: 'drop', value: String(v), role: 'swap' as BarRole }])
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
