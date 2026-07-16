import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, swapPairs } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '两两交换', en: 'Swap pairs' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const nh = swapPairs(head, {
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
