// 递归数组求和 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recSum } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5] };

export function buildTrace(input: { arr: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input.arr];

  rec
    .begin({ zh: `递归求和：[${a.join(', ')}]`, en: `Recursive sum: [${a.join(', ')}]` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '部分和', value: '0', role: 'frontier' }])
    .commit();

  let running = 0;
  const hooks = {
    onRecurse: (head: number, tailSum: number, total: number) => {
      running = total;
      rec
        .begin({ zh: `${head} + ${tailSum} = ${total}`, en: `${head} + ${tailSum} = ${total}` })
        .setBars(
          a.map((v) => ({ value: v, role: (v === head ? 'compare' : 'default') as BarRole })),
        )
        .setAux([{ label: '累计', value: String(running), role: 'final' as BarRole }])
        .commit();
    },
  };

  const total = recSum(input.arr, hooks);

  rec
    .begin({ zh: `总和 = ${total}`, en: `Sum = ${total}` })
    .setBars(a.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .commit();

  return rec.build();
}
