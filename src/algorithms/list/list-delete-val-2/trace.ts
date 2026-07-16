import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, removeElements } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 6, 3, 4, 6, 5], x: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '删除所有 ' + input.x, en: 'Remove all ' + input.x })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = removeElements(head, input.x, {
    onRemove: (v) =>
      rec
        .begin({ zh: '删除 ' + v, en: 'remove ' + v })
        .setAux([{ label: 'removed', value: String(v), role: 'swap' as BarRole }])
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
