// =============================================================================
// 有序链表并集 · 纯算法实现
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

export interface UnionHooks {
  onAppend?: (value: number) => void;
  onDone?: (head: ListNode | null) => void;
}

function appendOnce(tail: ListNode, value: number): ListNode {
  tail.next = { value, next: null };
  return tail.next;
}

/**
 * 求两条升序链表并集（新链表，去重）。
 */
export function unionSorted(
  a: ListNode | null,
  b: ListNode | null,
  hooks: UnionHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  const tryAppend = (value: number): void => {
    if (tail === dummy || tail.value !== value) {
      tail = appendOnce(tail, value);
      hooks.onAppend?.(value);
    }
  };
  while (a !== null && b !== null) {
    if (a.value === b.value) {
      tryAppend(a.value);
      a = a.next;
      b = b.next;
    } else if (a.value < b.value) {
      tryAppend(a.value);
      a = a.next;
    } else {
      tryAppend(b.value);
      b = b.next;
    }
  }
  while (a !== null) {
    tryAppend(a.value);
    a = a.next;
  }
  while (b !== null) {
    tryAppend(b.value);
    b = b.next;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
