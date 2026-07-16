// =============================================================================
// 链表快速排序 · 纯算法实现
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

export interface ListQuickSortHooks {
  onPivot?: (pivot: number) => void;
  onPartition?: (less: number, equal: number, greater: number) => void;
  onDone?: (head: ListNode | null) => void;
}

function concat(...lists: Array<ListNode | null>): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  for (const h of lists) {
    let cur = h;
    while (cur !== null) {
      tail.next = cur;
      tail = cur;
      cur = cur.next;
    }
  }
  tail.next = null;
  return dummy.next;
}

function tailOf(head: ListNode | null): ListNode | null {
  let cur = head;
  while (cur !== null && cur.next !== null) cur = cur.next;
  return cur;
}

/**
 * 链表三路快速排序（以头为基准）。
 */
export function listQuickSort(
  head: ListNode | null,
  hooks: ListQuickSortHooks = {},
): ListNode | null {
  if (head === null || head.next === null) return head;
  const pivot = head.value;
  hooks.onPivot?.(pivot);

  const lessD: ListNode = { value: NaN, next: null };
  const eqD: ListNode = { value: NaN, next: null };
  const gtD: ListNode = { value: NaN, next: null };
  let lt = lessD;
  let eq = eqD;
  let gt = gtD;
  let cur: ListNode | null = head;
  while (cur !== null) {
    const nxt: ListNode | null = cur.next;
    cur.next = null;
    if (cur.value < pivot) {
      lt.next = cur;
      lt = cur;
    } else if (cur.value === pivot) {
      eq.next = cur;
      eq = cur;
    } else {
      gt.next = cur;
      gt = cur;
    }
    cur = nxt;
  }
  hooks.onPartition?.(
    listToArray(lessD.next).length,
    listToArray(eqD.next).length,
    listToArray(gtD.next).length,
  );

  const sortedLess = listQuickSort(lessD.next, hooks);
  const sortedGreater = listQuickSort(gtD.next, hooks);
  const head1 = concat(sortedLess, eqD.next, sortedGreater);
  hooks.onDone?.(head1);
  void tailOf;
  return head1;
}
