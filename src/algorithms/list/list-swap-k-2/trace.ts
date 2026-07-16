import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapNodes } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec
    .begin({ zh: '交换第 ' + input.k + ' 与倒数 ' + input.k, en: 'Swap kth from both ends' })
    .setArray(
      [...input.arr],
      input.arr.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = swapNodes(head, input.k, {
    onSwap: (a, b) =>
      rec
        .begin({ zh: '交换 ' + a + ' ↔ ' + b, en: 'swap ' + a + ' ↔ ' + b })
        .setAux([{ label: 'swap', value: a + ',' + b, role: 'swap' as BarRole }])
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
