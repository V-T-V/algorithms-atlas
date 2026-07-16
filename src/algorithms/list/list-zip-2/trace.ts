import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, zipLists } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 3, 5], b: [2, 4, 6] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: '交替合并', en: 'Zip lists' }).commit();
  const h = zipLists(a, b, {
    onAppend: (v, src) =>
      rec
        .begin({ zh: '取 ' + v + ' from ' + src, en: 'take ' + v + ' from ' + src })
        .setAux([{ label: src, value: String(v), role: 'pivot' as BarRole }])
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
