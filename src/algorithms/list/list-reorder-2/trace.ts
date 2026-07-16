import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reorderList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '重排链表', en: 'Reorder list' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  reorderList(head, {
    onMerge: (a, b) =>
      rec
        .begin({ zh: a + ' → ' + b, en: a + ' → ' + b })
        .setAux([{ label: 'pair', value: a + ',' + b, role: 'pivot' as BarRole }])
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
