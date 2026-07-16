import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, deleteAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '删除第 ' + input.k + ' 个', en: 'Delete index ' + input.k })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = deleteAt(head, input.k, {
    onDelete: (v) =>
      rec
        .begin({ zh: '删除 ' + v, en: 'delete ' + v })
        .setAux([{ label: 'deleted', value: String(v), role: 'swap' as BarRole }])
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
