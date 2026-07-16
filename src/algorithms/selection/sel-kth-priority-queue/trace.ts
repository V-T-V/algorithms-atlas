import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthViaPriorityQueue } from './impl.ts';

export const DEFAULT_INPUT = { arr: [7, 2, 9, 4, 1, 8, 5, 3, 6, 0], k: 4 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  const popped: number[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    const poppedSet = new Set(popped);
    rec
      .begin(note)
      .setBars(
        arr.map((v, _i) => ({
          value: v,
          role: (poppedSet.has(v) ? 'sorted' : 'default') as BarRole,
          label: String(v),
        })),
      )
      .setAux([
        { label: '已弹出', value: popped.join(',') || '∅', role: 'sorted' as BarRole },
        { label: '目标 k', value: k.toString(), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `建最小堆 n=${arr.length}`, en: `Build min-heap n=${arr.length}` });

  const result = kthViaPriorityQueue(arr, k, {
    onPop: (v, i) => {
      popped.push(v);
      snap({ zh: `第 ${i} 次弹出 ${v}`, en: `Pop #${i}: ${v}` });
    },
  });

  rec
    .begin({ zh: `完成：第 ${k} 小 = ${result}`, en: `Done: ${k}-th smallest = ${result}` })
    .setBars(
      arr.map((v) => ({
        value: v,
        role: (v === result ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([{ label: '结果', value: `第 ${k} 小 = ${result}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
