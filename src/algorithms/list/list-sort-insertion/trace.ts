// =============================================================================
// 链表插入排序 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, listInsertionSort, type ListInsertionSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 1, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始：${input.join(' → ')}`, en: `Initial: ${input.join(' → ')}` })
    .setAux([{ label: 'input', value: input.join(' → '), role: 'frontier' }])
    .commit();

  let n = 0;
  const hooks: ListInsertionSortHooks = {
    onInsert: (v, pos) => {
      n++;
      rec
        .begin({ zh: `插入 ${v} 于位置 ${pos}`, en: `Insert ${v} at position ${pos}` })
        .setAux([
          { label: 'value', value: String(v), role: 'pivot' },
          { label: 'pos', value: String(pos), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = listInsertionSort(buildList(input), hooks);
  void n;
  const arr = listToArray(result);

  rec
    .begin({ zh: `结果：${arr.join(' → ')}`, en: `Result: ${arr.join(' → ')}` })
    .setAux([{ label: 'result', value: arr.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
