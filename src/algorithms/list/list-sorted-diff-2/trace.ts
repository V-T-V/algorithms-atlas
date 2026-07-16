import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, sortedDifference } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3, 5], b: [2, 4] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: 'A - B', en: 'A minus B' }).commit();
  const h = sortedDifference(a, b, {
    onKeep: (v) =>
      rec
        .begin({ zh: '保留 ' + v, en: 'keep ' + v })
        .setAux([{ label: 'keep', value: String(v), role: 'pivot' as BarRole }])
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
