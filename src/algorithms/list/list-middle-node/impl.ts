// =============================================================================
// 链表的中间节点 · 纯算法实现
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

export interface MiddleNodeHooks {
  onStep?: (slowValue: number, fastValue: number) => void;
  onDone?: (middle: ListNode | null) => void;
}

/**
 * 快慢指针找中点（偶数个节点返回右中点）。
 */
export function middleNode(head: ListNode | null, hooks: MiddleNodeHooks = {}): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    hooks.onStep?.(slow!.value, fast ? fast.value : NaN);
  }
  hooks.onDone?.(slow);
  return slow;
}
