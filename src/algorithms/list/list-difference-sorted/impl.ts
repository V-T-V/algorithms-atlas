// =============================================================================
// 有序链表差集 · 纯算法实现
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

export interface DifferenceHooks {
  onKeep?: (value: number) => void;
  onSkip?: (value: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 求差集 A − B（新链表，去重）。
 */
export function differenceSorted(
  a: ListNode | null,
  b: ListNode | null,
  hooks: DifferenceHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  const tryKeep = (value: number): void => {
    if (tail === dummy || tail.value !== value) {
      tail.next = { value, next: null };
      tail = tail.next;
      hooks.onKeep?.(value);
    } else {
      hooks.onSkip?.(value);
    }
  };
  while (a !== null && b !== null) {
    if (a.value === b.value) {
      hooks.onSkip?.(a.value);
      a = a.next;
      b = b.next;
    } else if (a.value < b.value) {
      tryKeep(a.value);
      a = a.next;
    } else {
      b = b.next;
    }
  }
  while (a !== null) {
    tryKeep(a.value);
    a = a.next;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
