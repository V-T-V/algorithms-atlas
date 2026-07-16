// =============================================================================
// 反转区间链表 · 纯算法实现
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

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

export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

export interface ReverseRangeHooks {
  onAnchor?: (anchorValue: number) => void;
  onMove?: (value: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 反转链表 [left, right] 区间（1-based）。要求 1 <= left <= right <= n。
 */
export function reverseRange(
  head: ListNode | null,
  left: number,
  right: number,
  hooks: ReverseRangeHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let anchor = dummy;
  for (let i = 1; i < left; i++) {
    anchor = anchor.next!;
  }
  hooks.onAnchor?.(anchor.value);
  // 区间内逐个头插到 anchor 之后
  const cur = anchor.next!;
  for (let i = 0; i < right - left; i++) {
    const nxt = cur.next!;
    cur.next = nxt.next;
    nxt.next = anchor.next;
    anchor.next = nxt;
    hooks.onMove?.(nxt.value);
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
