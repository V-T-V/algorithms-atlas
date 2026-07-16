import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deterministicSelect } from './impl.ts';

export const DEFAULT_INPUT = { arr: [9, 3, 7, 1, 8, 2, 6, 5, 4, 0], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  let lastPivot = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const sorted = [...arr].sort((a, b) => a - b);
    const target = sorted[k]!;
    arr.forEach((v, i) => {
      if (v === target) roles[i] = 'final';
    });
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: '目标 k', value: k.toString(), role: 'compare' as BarRole },
        { label: '上次 pivot', value: lastPivot.toString(), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始数组，目标第 ${k + 1} 小`, en: `Initial, target ${k + 1}-th smallest` });

  const result = deterministicSelect(arr, k, {
    onPivot: (p) => {
      lastPivot = p;
      snap({ zh: `选中位数中位数 pivot=${p}`, en: `Median-of-medians pivot=${p}` });
    },
  });

  rec
    .begin({ zh: `完成：第 ${k + 1} 小 = ${result}`, en: `Done: ${k + 1}-th smallest = ${result}` })
    .setBars(
      rec.barsFrom(
        arr,
        arr.reduce(
          (acc, v, i) => {
            if (v === result) acc[i] = 'final' as BarRole;
            return acc;
          },
          {} as Record<number, BarRole>,
        ),
      ),
    )
    .setAux([{ label: '结果', value: `第 ${k + 1} 小 = ${result}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
