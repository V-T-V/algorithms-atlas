// =============================================================================
// 反转链表 · 录制帧序列
// 用 setArray 展示链表数值，pointers 标注 prev/curr/next 三指针位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildList,
  listToArray,
  reverseList,
  type ListNode,
  type ReverseListHooks,
} from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

/** 把链表节点映射回原数组的下标（按节点身份引用）。 */
function indexByReference(values: readonly number[], head: ListNode | null): Map<ListNode, number> {
  const map = new Map<ListNode, number>();
  let cur = head;
  let i = 0;
  while (cur) {
    map.set(cur, i++);
    cur = cur.next;
  }
  return map;
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  // 反转过程中我们用「当前链表数组」+ 指针来表示。
  // 简化：每帧根据当前链表结构重新拍平。
  let displayValues = [...input];

  // 记录每个原始节点的下标（通过引用）—— 在翻转后顺序会变化，
  // 我们这里维护「按翻转后顺序排列的值数组」来直观展示结果。
  const ptrIndex = (node: ListNode | null, idxMap: Map<ListNode, number>): number => {
    if (node === null) return -1;
    return idxMap.get(node) ?? -1;
  };

  // 初始：建立 引用→下标 的映射（基于原始链表，下标即位置）
  const idxMap = indexByReference(input, head);

  const snapshot = (
    note: { zh: string; en: string },
    prev: ListNode | null,
    curr: ListNode | null,
    next: ListNode | null,
    flippedUpTo: number, // 已翻转的节点中，curr 所处的「已处理」标记位
  ): void => {
    const roles: BarRole[] = input.map(() => 'default');
    // 已翻转部分（小于 curr 原下标且 <= flippedUpTo）标 sorted
    // 这里用更简单语义：curr 标 pivot、prev 标 compare、next 标 swap
    const pi = ptrIndex(prev, idxMap);
    const ci = ptrIndex(curr, idxMap);
    const ni = ptrIndex(next, idxMap);
    for (let k = 0; k <= flippedUpTo && ci >= 0; k++) {
      if (k < ci) roles[k] = 'sorted';
    }
    if (pi >= 0) roles[pi] = 'compare';
    if (ci >= 0) roles[ci] = 'pivot';
    if (ni >= 0) roles[ni] = 'swap';
    const pointers: Array<{ index: number; label: string }> = [];
    if (pi >= 0) pointers.push({ index: pi, label: 'prev' });
    if (ci >= 0) pointers.push({ index: ci, label: 'curr' });
    if (ni >= 0) pointers.push({ index: ni, label: 'next' });

    rec.begin(note).setArray(displayValues, roles, pointers).commit();
  };

  const hooks: ReverseListHooks = {
    onFlip: (prev, curr, next) => {
      // 在翻转发生后，链表逻辑结构改变；这里用下标计数作为翻转进度
      const flippedUpTo = curr ? ptrIndex(curr, idxMap) : -1;
      snapshot(
        {
          zh: `翻转：curr.next = prev（节点 ${curr?.value} → 指回 ${prev ? prev.value : 'null'}）`,
          en: `Flip: curr.next = prev (node ${curr?.value} → points back to ${prev ? prev.value : 'null'})`,
        },
        prev,
        curr,
        next,
        flippedUpTo,
      );
    },
    onDone: () => {
      // done
    },
  };

  rec
    .begin({
      zh: `初始链表：${input.join(' → ')} → null`,
      en: `Initial list: ${input.join(' → ')} → null`,
    })
    .setArray(
      displayValues,
      input.map(() => 'frontier'),
      [{ index: 0, label: 'head' }],
    )
    .commit();

  const newHead = reverseList(head, hooks);
  displayValues = listToArray(newHead);

  // 终态：反转后的链表
  rec
    .begin({
      zh: `反转完成：${displayValues.join(' → ')} → null`,
      en: `Reversed: ${displayValues.join(' → ')} → null`,
    })
    .setArray(
      displayValues,
      displayValues.map(() => 'final'),
      [{ index: 0, label: 'head' }],
    )
    .commit();

  return rec.build();
}
