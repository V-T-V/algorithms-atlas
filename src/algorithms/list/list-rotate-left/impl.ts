// =============================================================================
// 链表左旋 · 纯算法实现
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

export interface RotateLeftHooks {
  onNewHead?: (newHeadValue: number) => void;
  onCut?: (cutValue: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 左旋 k 位。
 */
export function rotateLeft(
  head: ListNode | null,
  k: number,
  hooks: RotateLeftHooks = {},
): ListNode | null {
  if (head === null || head.next === null) {
    hooks.onDone?.(head);
    return head;
  }
  let len = 1;
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    len++;
  }
  k = ((k % len) + len) % len;
  if (k === 0) {
    hooks.onDone?.(head);
    return head;
  }
  // 新头是第 k 个节点（0-based），其前驱为新尾
  let newTail = head;
  for (let i = 0; i < k - 1; i++) {
    newTail = newTail.next!;
  }
  const newHead = newTail.next!;
  hooks.onNewHead?.(newHead.value);
  tail.next = head; // 接上
  newTail.next = null; // 断开
  hooks.onCut?.(newTail.value);
  hooks.onDone?.(newHead);
  return newHead;
}
