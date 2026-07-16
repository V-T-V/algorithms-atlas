// =============================================================================
// 合并有序链表（哑节点变种）· 纯算法实现
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

export interface MergeSortedAltHooks {
  onPick?: (value: number, from: 'a' | 'b') => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 哑节点拼接合并两条升序链表（复用原节点）。
 */
export function mergeSortedAlt(
  a: ListNode | null,
  b: ListNode | null,
  hooks: MergeSortedAltHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      hooks.onPick?.(a.value, 'a');
      tail.next = a;
      a = a.next;
    } else {
      hooks.onPick?.(b.value, 'b');
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
