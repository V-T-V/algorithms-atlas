// =============================================================================
// 反转链表 II（Reverse Linked List II）· 纯算法实现
// 反转从位置 left 到 right（1-based）的子链表。零 DOM 依赖，可独立单测。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 从数值数组构建单链表，返回头节点。 */
export function buildList(values: readonly number[]): ListNode | null {
  if (values.length === 0) return null;
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  for (const v of values) {
    tail.next = { value: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}

/** 把链表拍平成数值数组（便于断言）。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReverseIIHooks {
  /** 翻转一个节点：curr.next 指向 prev。 */
  onFlip?: (prev: ListNode | null, curr: ListNode) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 反转链表 [left, right]（1-based, left<=right）。
 * 时间 O(n)，空间 O(1)。
 */
export function reverseII(
  head: ListNode | null,
  left: number,
  right: number,
  hooks: ReverseIIHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  // 走到 left 的前驱
  let pre = dummy;
  for (let i = 1; i < left; i++) pre = pre.next!;
  const segTail = pre.next!; // 反转段的第一个节点（反转后变最后）
  // 头插法反转 [left, right]
  let cur: ListNode | null = segTail.next;
  let prev: ListNode | null = segTail;
  for (let i = left; i < right; i++) {
    const nxt: ListNode | null = cur!.next;
    cur!.next = pre.next;
    pre.next = cur;
    segTail.next = nxt;
    hooks.onFlip?.(prev, cur!);
    prev = cur;
    cur = nxt;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
