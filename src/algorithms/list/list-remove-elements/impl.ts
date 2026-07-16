// =============================================================================
// 移除链表元素 · 纯算法实现
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

export interface RemoveElementsHooks {
  onRemove?: (value: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 删除链表中所有等于 val 的节点。
 */
export function removeElements(
  head: ListNode | null,
  val: number,
  hooks: RemoveElementsHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  let cur = head;
  while (cur !== null) {
    if (cur.value === val) {
      prev.next = cur.next;
      hooks.onRemove?.(cur.value);
    } else {
      prev = cur;
    }
    cur = cur.next;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
