import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedIntersect } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3, 5], b: [2, 3, 4, 5, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: '有序交集', en: 'Sorted intersect' }).commit();
  const h = sortedIntersect(a, b, {
    onMatch: (v) =>
      rec
        .begin({ zh: '命中 ' + v, en: 'match ' + v })
        .setAux([{ label: 'match', value: String(v), role: 'final' as BarRole }])
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
