import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reverseAltKGroup } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5, 6, 7, 8], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '交替k组反转', en: 'Reverse alt k-group' })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = reverseAltKGroup(head, input.k, {
    onGroup: (idx, rev) =>
      rec
        .begin({
          zh: '组 ' + idx + (rev ? ' 反转' : ' 保持'),
          en: 'group ' + idx + (rev ? ' reverse' : ' keep'),
        })
        .setAux([{ label: 'group', value: String(idx), role: 'pivot' as BarRole }])
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
