// =============================================================================
// 链表冒泡排序 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, listBubbleSort, type ListBubbleSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 1, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始：${input.join(' → ')}`, en: `Initial: ${input.join(' → ')}` })
    .setAux([{ label: 'input', value: input.join(' → '), role: 'frontier' }])
    .commit();

  let swaps = 0;
  const hooks: ListBubbleSortHooks = {
    onSwap: (a, b) => {
      swaps++;
      rec
        .begin({ zh: `交换 ${a} ↔ ${b}`, en: `Swap ${a} ↔ ${b}` })
        .setAux([
          { label: 'a', value: String(a), role: 'compare' },
          { label: 'b', value: String(b), role: 'swap' },
          { label: 'swaps', value: String(swaps), role: 'pivot' },
        ])
        .commit();
    },
    onPass: (p) => {
      rec
        .begin({ zh: `完成第 ${p} 轮`, en: `Pass ${p} done` })
        .setAux([{ label: 'pass', value: String(p), role: 'frontier' }])
        .commit();
    },
  };

  const result = listBubbleSort(buildList(input), hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
