// =============================================================================
// 链表插入排序 · 纯算法实现
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

export interface ListInsertionSortHooks {
  onInsert?: (value: number, position: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 链表插入排序。
 */
export function listInsertionSort(
  head: ListNode | null,
  hooks: ListInsertionSortHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;
    // 在已排序段中找插入位置
    let prev = dummy;
    let pos = 0;
    while (prev.next !== null && prev.next.value < cur.value) {
      prev = prev.next;
      pos++;
    }
    cur.next = prev.next;
    prev.next = cur;
    hooks.onInsert?.(cur.value, pos);
    cur = nxt;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
