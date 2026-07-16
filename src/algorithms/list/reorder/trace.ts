// =============================================================================
// 重排链表 · 录制帧序列
// setArray 展示链表数值；分阶段标注中点、反转、合并。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, reorder, type ReorderHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let midIdx = -1;
  let revIdx = -1;

  const snap = (note: { zh: string; en: string }, roles: BarRole[]): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    if (midIdx >= 0) pointers.push({ index: midIdx, label: 'mid' });
    if (revIdx >= 0) pointers.push({ index: revIdx, label: 'rev' });
    rec
      .begin(note)
      .setArray([...values], roles, pointers)
      .commit();
  };

  snap(
    { zh: '重排：找中点 → 反转后半 → 交错合并', en: 'Reorder: mid → reverse → merge' },
    new Array(n).fill('frontier'),
  );

  const hooks: ReorderHooks = {
    onMid: () => {
      midIdx = Math.floor((n - 1) / 2);
      snap({ zh: `中点 @${midIdx}`, en: `Mid @${midIdx}` }, new Array(n).fill('default'));
    },
    onReverse: () => {
      revIdx = midIdx + 1;
      snap({ zh: '后半已反转', en: 'Second half reversed' }, new Array(n).fill('default'));
    },
    onMerge: () => {},
    onDone: () => {},
  };
  void hooks;

  const newHead = reorder(buildList(input), hooks);
  const finalValues = listToArray(newHead);
  midIdx = -1;
  revIdx = -1;
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}
