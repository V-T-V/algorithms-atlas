// =============================================================================
// 链表选择排序 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, listSelectionSort, type ListSelectionSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 1, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始：${input.join(' → ')}`, en: `Initial: ${input.join(' → ')}` })
    .setAux([{ label: 'input', value: input.join(' → '), role: 'frontier' }])
    .commit();

  let round = 0;
  const hooks: ListSelectionSortHooks = {
    onMin: (v, at) => {
      round++;
      rec
        .begin({
          zh: `第 ${round} 轮最小值 ${v}（位置 ${at}）`,
          en: `Round ${round} min ${v} (pos ${at})`,
        })
        .setAux([
          { label: 'min', value: String(v), role: 'pivot' },
          { label: 'at', value: String(at), role: 'compare' },
        ])
        .commit();
    },
    onSwap: (i, j) => {
      rec
        .begin({ zh: `交换位置 ${i} 与 ${j}`, en: `Swap positions ${i} and ${j}` })
        .setAux([
          { label: 'i', value: String(i), role: 'swap' },
          { label: 'j', value: String(j), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = listSelectionSort(buildList(input), hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
