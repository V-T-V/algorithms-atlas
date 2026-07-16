// =============================================================================
// 链表快速排序 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, listQuickSort, type ListQuickSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 4, 1, 3, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始：${input.join(' → ')}`, en: `Initial: ${input.join(' → ')}` })
    .setAux([{ label: 'input', value: input.join(' → '), role: 'frontier' }])
    .commit();

  const hooks: ListQuickSortHooks = {
    onPivot: (p) => {
      rec
        .begin({ zh: `选取基准 ${p}`, en: `Pivot ${p}` })
        .setAux([{ label: 'pivot', value: String(p), role: 'pivot' }])
        .commit();
    },
    onPartition: (l, e, g) => {
      rec
        .begin({
          zh: `三路划分：<${l} 个，=${e} 个，>${g} 个`,
          en: `Partition: <${l}, =${e}, >${g}`,
        })
        .setAux([
          { label: 'less', value: String(l), role: 'compare' },
          { label: 'equal', value: String(e), role: 'pivot' },
          { label: 'greater', value: String(g), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = listQuickSort(buildList(input), hooks);
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
