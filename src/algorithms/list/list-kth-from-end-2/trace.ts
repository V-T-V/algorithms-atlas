import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, kthFromEnd } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '倒数第 ' + input.k, en: 'kth from end' })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const v = kthFromEnd(head, input.k, {
    onArrive: (val) =>
      rec
        .begin({ zh: '到达 ' + val, en: 'arrive ' + val })
        .setAux([{ label: 'value', value: String(val), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果 = ' + v, en: 'result = ' + v })
    .setAux([{ label: 'result', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
