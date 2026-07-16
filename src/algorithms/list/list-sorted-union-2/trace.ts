import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedUnion } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [2, 3, 4, 5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: '有序并集', en: 'Sorted union' }).commit();
  const h = sortedUnion(a, b, {
    onAdd: (v) =>
      rec
        .begin({ zh: '加入 ' + v, en: 'add ' + v })
        .setAux([{ label: 'add', value: String(v), role: 'pivot' as BarRole }])
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
