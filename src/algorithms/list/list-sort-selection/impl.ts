// =============================================================================
// 链表选择排序 · 纯算法实现
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

export interface ListSelectionSortHooks {
  onMin?: (value: number, at: number) => void;
  onSwap?: (i: number, j: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 链表选择排序（交换数值）。
 */
export function listSelectionSort(
  head: ListNode | null,
  hooks: ListSelectionSortHooks = {},
): ListNode | null {
  let cur = head;
  let pos = 0;
  while (cur !== null) {
    let minNode = cur;
    let minPos = pos;
    let scan = cur.next;
    let scanPos = pos + 1;
    while (scan !== null) {
      if (scan.value < minNode.value) {
        minNode = scan;
        minPos = scanPos;
      }
      scan = scan.next;
      scanPos++;
    }
    hooks.onMin?.(minNode.value, minPos);
    if (minNode !== cur) {
      const tmp = cur.value;
      cur.value = minNode.value;
      minNode.value = tmp;
      hooks.onSwap?.(pos, minPos);
    }
    cur = cur.next;
    pos++;
  }
  hooks.onDone?.(head);
  return head;
}
