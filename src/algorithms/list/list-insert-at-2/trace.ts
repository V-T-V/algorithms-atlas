import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, insertAt } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 4], k: 2, x: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({
      zh: '在第 ' + input.k + ' 位插入 ' + input.x,
      en: 'Insert ' + input.x + ' at ' + input.k,
    })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = insertAt(head, input.k, input.x, {
    onInsert: (i, v) =>
      rec
        .begin({ zh: '插入 ' + v + ' @' + i, en: 'insert ' + v + ' @' + i })
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
