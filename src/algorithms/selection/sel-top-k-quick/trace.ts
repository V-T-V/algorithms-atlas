import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { topKQuick } from './impl.ts';

export const DEFAULT_INPUT = { arr: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3], k: 3 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const _order = arr.length - k;
  let pivotVal = -1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr))
      .setAux([
        { label: 'k', value: k.toString(), role: 'compare' as BarRole },
        { label: 'pivot', value: pivotVal.toString(), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始数组，Top-${k}`, en: `Init, Top-${k}` });

  const result = topKQuick(arr, k, {
    onPivot: (p) => {
      pivotVal = p;
      snap({ zh: `pivot=${p}`, en: `pivot=${p}` });
    },
  });

  // 标记 top-k 区域
  const topSet = new Set(result);
  rec
    .begin({
      zh: `完成：Top-${k} = [${result.join(',')}]`,
      en: `Done: Top-${k} = [${result.join(',')}]`,
    })
    .setBars(
      arr.map((v) => ({
        value: v,
        role: (topSet.has(v) ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([{ label: '结果', value: result.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
