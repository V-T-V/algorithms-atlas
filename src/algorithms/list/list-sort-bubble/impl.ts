// =============================================================================
// 链表冒泡排序 · 纯算法实现
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

export interface ListBubbleSortHooks {
  onSwap?: (a: number, b: number) => void;
  onPass?: (pass: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 链表冒泡排序（交换数值）。
 */
export function listBubbleSort(
  head: ListNode | null,
  hooks: ListBubbleSortHooks = {},
): ListNode | null {
  if (head === null || head.next === null) return head;
  let end: ListNode | null = null;
  let swapped = true;
  let pass = 0;
  while (swapped) {
    swapped = false;
    let cur: ListNode | null = head;
    let lastSwap: ListNode | null = null;
    while (cur !== null && cur.next !== null && cur.next !== end) {
      if (cur.value > cur.next.value) {
        const tmp = cur.value;
        cur.value = cur.next.value;
        cur.next.value = tmp;
        hooks.onSwap?.(cur.next.value, cur.value);
        swapped = true;
        lastSwap = cur.next;
      }
      cur = cur.next;
    }
    pass++;
    hooks.onPass?.(pass);
    // 优化：记录最后一次交换位置作为下一轮终点
    end = lastSwap ?? end;
    if (!swapped) break;
  }
  hooks.onDone?.(head);
  return head;
}
