// =============================================================================
// 删除重复元素 II · 录制帧序列
// setArray 展示链表数值；pointer 标注 prev。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildList,
  listToArray,
  deleteDuplicates2,
  type ListNode,
  type DeleteDuplicates2Hooks,
} from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 3, 4, 4, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  const n = input.length;
  let prevIdx = -1;
  let rangeStartIdx = -1;
  let roleTip: BarRole = 'default';

  const idxMap = new Map<ListNode, number>();
  let k = 0;
  for (let c: ListNode | null = head; c; c = c.next) idxMap.set(c, k++);

  const snap = (note: { zh: string; en: string }): void => {
    const values = listToArray(head);
    const roles: BarRole[] = new Array(n).fill('default');
    if (prevIdx >= 0 && prevIdx < n) roles[prevIdx] = 'pivot';
    if (rangeStartIdx >= 0) roles[rangeStartIdx] = roleTip;
    const pointers: Array<{ index: number; label: string }> =
      prevIdx >= 0 ? [{ index: prevIdx, label: 'prev' }] : [];
    rec.begin(note).setArray(values, roles, pointers).commit();
    roleTip = 'default';
  };

  snap({ zh: '只保留出现一次的值', en: 'Keep only singletons' });

  const hooks: DeleteDuplicates2Hooks = {
    onDupRange: (value, dupStart) => {
      rangeStartIdx = idxMap.get(dupStart) ?? -1;
      roleTip = 'warn';
      snap({ zh: `检测到重复值 ${value}`, en: `Dup value ${value}` });
    },
    onDeleteRange: (value) => {
      roleTip = 'swap';
      snap({ zh: `删除整段 ${value}`, en: `Delete range ${value}` });
    },
    onDone: () => {},
  };
  void prevIdx; // prev 由 dummy 维护，不追踪具体下标
  prevIdx = -1;

  const newHead = deleteDuplicates2(head, hooks);

  const finalValues = listToArray(newHead);
  rec
    .begin({ zh: `完成：${finalValues.join(' → ')}`, en: `Done: ${finalValues.join(' → ')}` })
    .setArray(finalValues, new Array(finalValues.length).fill('final'), [])
    .commit();
  return rec.build();
}
