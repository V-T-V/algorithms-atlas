// =============================================================================
// 链表右旋（成环变种）· 纯算法实现
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

export interface RotateRightHooks {
  onCloseRing?: (len: number) => void;
  onCut?: (newHeadValue: number, cutValue: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 右旋 k 位（成环法）。
 */
export function rotateRight2(
  head: ListNode | null,
  k: number,
  hooks: RotateRightHooks = {},
): ListNode | null {
  if (head === null || head.next === null || k === 0) {
    hooks.onDone?.(head);
    return head;
  }
  // 计算长度并把链表连成环
  let len = 1;
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    len++;
  }
  tail.next = head;
  hooks.onCloseRing?.(len);

  k = ((k % len) + len) % len;
  const steps = len - k; // 新尾前进步数
  for (let i = 0; i < steps; i++) {
    tail = tail.next!;
  }
  const newHead = tail.next!;
  hooks.onCut?.(newHead.value, tail.value);
  tail.next = null;
  hooks.onDone?.(newHead);
  return newHead;
}
