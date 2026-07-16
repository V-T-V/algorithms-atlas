import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, rotateRight } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '右旋 ' + input.k, en: 'Rotate right ' + input.k })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = rotateRight(head, input.k, {
    onCut: (v) =>
      rec
        .begin({ zh: '在 ' + v + ' 后断开', en: 'cut after ' + v })
        .setAux([{ label: 'cut', value: String(v), role: 'swap' as BarRole }])
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
