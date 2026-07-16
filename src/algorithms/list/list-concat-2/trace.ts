import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, concatList } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2], b: [3, 4, 5] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: '连接', en: 'Concat' }).commit();
  const h = concatList(a, b, {
    onAppend: (v) =>
      rec
        .begin({ zh: '追加 ' + v, en: 'append ' + v })
        .setAux([{ label: 'append', value: String(v), role: 'pivot' as BarRole }])
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
