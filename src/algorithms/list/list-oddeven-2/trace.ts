import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, oddEvenList } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '奇偶分离', en: 'Odd even' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = oddEvenList(head, {
    onGroup: (v, side) =>
      rec
        .begin({ zh: v + ' → ' + side, en: v + ' → ' + side })
        .setAux([
          {
            label: side,
            value: String(v),
            role: (side === 'odd' ? 'pivot' : 'frontier') as BarRole,
          },
        ])
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
