import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, partition } from './impl.ts';
export const DEFAULT_INPUT = { arr: [3, 5, 8, 5, 10, 2, 1], x: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '按 ' + input.x + ' 分区', en: 'Partition by ' + input.x })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = partition(head, input.x, {
    onMove: (v, side) =>
      rec
        .begin({ zh: v + ' → ' + side, en: v + ' → ' + side })
        .setAux([
          {
            label: side,
            value: String(v),
            role: (side === 'lt' ? 'pivot' : 'frontier') as BarRole,
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
