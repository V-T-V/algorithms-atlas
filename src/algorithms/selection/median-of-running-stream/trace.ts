// 滑动窗口中位数 · 录制帧序列
// 用 setArray 展示窗口（高亮当前 k 个元素），用 setAux 展示两堆与中位数。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { windowMedian, type WindowMedianHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  let winStart = -1;
  let winEnd = -1;
  let curMed: number | null = null;
  let lowerN = 0;
  let upperN = 0;

  const rolesFor = (): BarRole[] => {
    const roles: BarRole[] = new Array(arr.length).fill('default');
    if (winStart >= 0) {
      for (let i = winStart; i <= winEnd; i++) roles[i] = 'frontier';
      if (curMed !== null && curMed >= winStart && curMed <= winEnd) roles[curMed] = 'pivot';
    }
    return roles;
  };

  rec
    .begin({ zh: `数组 ${JSON.stringify(arr)}，窗口 k=${k}`, en: `Array, window k=${k}` })
    .setArray(arr, [], [])
    .setAux([{ label: '窗口', value: '∅', role: 'frontier' as BarRole }])
    .commit();

  const hooks: WindowMedianHooks = {
    onRebalance: (l, u) => {
      lowerN = l;
      upperN = u;
    },
    onWindow: (start, end, med) => {
      winStart = start;
      winEnd = end;
      curMed = med;
      const winStr = arr.slice(start, end + 1).join(', ');
      rec
        .begin({
          zh: `窗口 [${start}, ${end}] = [${winStr}]，中位数 = ${med}`,
          en: `Window [${start}, ${end}] = [${winStr}], median = ${med}`,
        })
        .setArray(arr, rolesFor(), [{ index: med, label: 'med' }])
        .setAux([
          { label: '中位数', value: String(med), role: 'pivot' as BarRole },
          { label: 'lower 堆大小', value: String(lowerN), role: 'compare' as BarRole },
          { label: 'upper 堆大小', value: String(upperN), role: 'compare' as BarRole },
          { label: '窗口', value: `[${winStr}]`, role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const result = windowMedian(arr, k, hooks);

  // 终态
  winStart = -1;
  curMed = null;
  rec
    .begin({ zh: `共 ${result.count} 个中位数`, en: `${result.count} medians total` })
    .setArray(arr, [], [])
    .setAux([
      { label: '中位数序列', value: JSON.stringify(result.medians), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n log k)', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
