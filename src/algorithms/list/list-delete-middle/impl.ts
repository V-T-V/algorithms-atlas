// =============================================================================
// 删除链表中间节点（LeetCode 2095）· 纯算法实现
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

export interface DeleteMiddleHooks {
  onFound?: (middleValue: number) => void;
  onDelete?: (middleValue: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 删除链表的中间节点（向下取整，单节点删完返回 null）。
 */
export function deleteMiddle(
  head: ListNode | null,
  hooks: DeleteMiddleHooks = {},
): ListNode | null {
  if (head === null || head.next === null) {
    hooks.onDone?.(null);
    return null;
  }
  // prev 落后 slow 一步
  let prev: ListNode | null = null;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    prev = slow;
    slow = slow!.next;
    fast = fast.next.next;
  }
  hooks.onFound?.(slow!.value);
  // 跳过 slow
  prev!.next = slow!.next;
  hooks.onDelete?.(slow!.value);
  hooks.onDone?.(head);
  return head;
}
