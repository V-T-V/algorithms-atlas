import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topKHeap } from './impl.ts';

export const DEFAULT_INPUT = { arr: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3], k: 3 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const inHeap = new Set<number>();

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        arr.map((v, i) => ({
          value: v,
          role: (inHeap.has(i) ? 'final' : 'default') as BarRole,
          label: String(v),
        })),
      )
      .setAux([{ label: '堆大小', value: k.toString(), role: 'compare' as BarRole }])
      .commit();
  };

  snap({ zh: `初始数组，Top-${k}`, en: `Init, Top-${k}` });

  topKHeap(arr, k, {
    onPush: (v) => {
      const idx = arr.indexOf(v);
      if (idx >= 0) inHeap.add(idx);
      snap({ zh: `入堆 ${v}`, en: `Push ${v}` });
    },
    onReplace: (out, inn) => {
      const iOut = arr.indexOf(out);
      const iIn = arr.indexOf(inn);
      if (iOut >= 0) inHeap.delete(iOut);
      if (iIn >= 0) inHeap.add(iIn);
      snap({ zh: `替换 ${out} → ${inn}`, en: `Replace ${out} → ${inn}` });
    },
  });

  const result = topKHeap(arr, k);
  rec
    .begin({
      zh: `完成：Top-${k} = [${result.join(',')}]`,
      en: `Done: Top-${k} = [${result.join(',')}]`,
    })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([{ label: '结果', value: result.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
