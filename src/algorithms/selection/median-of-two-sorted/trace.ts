// =============================================================================
// 两个有序数组的中位数 · 录制帧序列
// 通过 medianOfTwoSorted 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOfTwoSorted, type MedianOfTwoSortedHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  a: [1, 3, 5, 7],
  b: [2, 4, 6, 8, 9],
};

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  let curI = 0;
  let curJ = 0;
  let result = 0;

  const render = (note: { zh: string; en: string }): void => {
    // 用 array viz 展示两个数组与切分指针
    const m = a.length;
    const n = b.length;
    const aRoles: BarRole[] = new Array(m).fill('default');
    const bRoles: BarRole[] = new Array(n).fill('default');
    for (let i = 0; i < curI && i < m; i++) aRoles[i] = 'sorted';
    for (let j = 0; j < curJ && j < n; j++) bRoles[j] = 'sorted';
    if (curI >= 0 && curI < m) aRoles[curI] = 'pivot';
    if (curJ >= 0 && curJ < n) bRoles[curJ] = 'pivot';

    const aux = [
      {
        label: '数组 A',
        value: a.join(', '),
        role: 'compare' as BarRole,
      },
      {
        label: '数组 B',
        value: b.join(', '),
        role: 'frontier' as BarRole,
      },
      {
        label: '切分 i / j',
        value: `${curI} / ${curJ}`,
        role: 'pivot' as BarRole,
      },
    ];
    rec
      .begin(note)
      .setBars(
        // 用 bars 综合展示：前 m 个为 A，后 n 个为 B
        [
          ...a.map((v, i) => ({ value: v, role: aRoles[i]!, label: `A${i}` })),
          ...b.map((v, j) => ({ value: v, role: bRoles[j]!, label: `B${j}` })),
        ],
      )
      .setAux(aux)
      .commit();
  };

  render({ zh: `初始：A=[${a}]，B=[${b}]`, en: `Init: A=[${a}], B=[${b}]` });

  const hooks: MedianOfTwoSortedHooks = {
    onPartition: (i, j) => {
      curI = i;
      curJ = j;
      render({ zh: `二分：切分 i=${i}，j=${j}`, en: `Binary search: partition i=${i}, j=${j}` });
    },
    onValid: (leftMax, rightMin) => {
      render({
        zh: `合法划分：左最大=${leftMax}，右最小=${rightMin}`,
        en: `Valid partition: leftMax=${leftMax}, rightMin=${rightMin}`,
      });
    },
    onDone: (median) => {
      result = median;
      render({ zh: `中位数 = ${median}`, en: `Median = ${median}` });
    },
  };

  medianOfTwoSorted(a, b, hooks);

  // 终态
  rec
    .begin({ zh: `结果：中位数 = ${result}`, en: `Result: median = ${result}` })
    .setAux([{ label: '中位数', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
