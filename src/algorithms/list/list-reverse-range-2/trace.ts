import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseBetween } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], m: 2, n: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({
      zh: '反转 [' + input.m + ',' + input.n + ']',
      en: 'Reverse [' + input.m + ',' + input.n + ']',
    })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = reverseBetween(head, input.m, input.n, {
    onMove: (v) =>
      rec
        .begin({ zh: '移动 ' + v, en: 'move ' + v })
        .setAux([{ label: 'move', value: String(v), role: 'swap' as BarRole }])
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
