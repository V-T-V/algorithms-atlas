// 递归数组求积 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { recProduct } from './impl.ts';

export const DEFAULT_INPUT = { arr: [2, 3, 4, 5] };

export function buildTrace(input: { arr: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input.arr];

  rec
    .begin({ zh: `递归求积：[${a.join(', ')}]`, en: `Recursive product: [${a.join(', ')}]` })
    .setBars(rec.barsFrom(a))
    .setAux([{ label: '积', value: '1', role: 'frontier' }])
    .commit();

  const hooks = {
    onRecurse: (head: number, tailProd: number, total: number) => {
      rec
        .begin({ zh: `${head} * ${tailProd} = ${total}`, en: `${head} * ${tailProd} = ${total}` })
        .setBars(
          a.map((v) => ({ value: v, role: (v === head ? 'compare' : 'default') as BarRole })),
        )
        .setAux([{ label: '部分积', value: String(total), role: 'final' as BarRole }])
        .commit();
    },
  };

  const total = recProduct(input.arr, hooks);

  rec
    .begin({ zh: `积 = ${total}`, en: `Product = ${total}` })
    .setBars(a.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .commit();

  return rec.build();
}
