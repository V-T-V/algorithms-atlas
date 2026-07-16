import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, mergeSorted } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 5], b: [2, 4, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec
    .begin({
      zh: '合并 ' + JSON.stringify(input.a) + ' 与 ' + JSON.stringify(input.b),
      en: 'Merge',
    })
    .commit();
  const merged = mergeSorted(a, b, {
    onAppend: (v) =>
      rec
        .begin({ zh: '追加 ' + v, en: 'append ' + v })
        .setAux([{ label: 'appended', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  const arr = listToArray(merged);
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
