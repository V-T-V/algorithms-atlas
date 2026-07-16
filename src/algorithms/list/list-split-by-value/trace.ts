// =============================================================================
// 按值分割链表 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, splitByValue } from './impl.ts';

export const DEFAULT_INPUT = { values: [3, 1, 4, 1, 5, 9, 2, 6], pivot: 4 };

export function buildTrace(input: { values: number[]; pivot: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, pivot } = input;

  rec
    .begin({
      zh: `初始：${values.join(' → ')}，pivot=${pivot}`,
      en: `Initial: ${values.join(' → ')}, pivot=${pivot}`,
    })
    .setAux([
      { label: 'pivot', value: String(pivot), role: 'pivot' },
      { label: 'left', value: '-', role: 'frontier' },
      { label: 'right', value: '-', role: 'frontier' },
    ])
    .commit();

  const { left, right } = splitByValue(buildList(values), pivot);
  const leftArr = listToArray(left);
  const rightArr = listToArray(right);

  rec
    .begin({ zh: `左段：${leftArr.join(' → ') || '∅'}`, en: `Left: ${leftArr.join(' → ') || '∅'}` })
    .setAux([{ label: 'left', value: leftArr.join(' → ') || '∅', role: 'compare' }])
    .commit();

  rec
    .begin({
      zh: `结果：left=${leftArr.join(' → ') || '∅'}, right=${rightArr.join(' → ') || '∅'}`,
      en: `Result: left=${leftArr.join(' → ') || '∅'}, right=${rightArr.join(' → ') || '∅'}`,
    })
    .setAux([
      { label: 'left', value: leftArr.join(' → ') || '∅', role: 'final' },
      { label: 'right', value: rightArr.join(' → ') || '∅', role: 'final' },
    ])
    .commit();
  return rec.build();
}
