import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, addTwoNumbers } from './impl.ts';
export const DEFAULT_INPUT = { a: [2, 4, 3], b: [5, 6, 4] }; // 342 + 465 = 807
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = buildList(input.a),
    b = buildList(input.b);
  rec.begin({ zh: '342 + 465', en: '342 + 465' }).commit();
  const h = addTwoNumbers(a, b, {
    onDigit: (d, c) =>
      rec
        .begin({ zh: '位 ' + d + ' 进位 ' + c, en: 'digit ' + d + ' carry ' + c })
        .setAux([
          { label: 'digit', value: String(d), role: 'pivot' as BarRole },
          { label: 'carry', value: String(c), role: 'frontier' as BarRole },
        ])
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
