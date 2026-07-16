// =============================================================================
// 有序链表交集 · 纯算法实现
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

export interface IntersectionHooks {
  onMatch?: (value: number) => void;
  onAdvance?: (which: 'a' | 'b') => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 求两条升序链表交集（返回新链表，去重）。
 */
export function intersectionSorted(
  a: ListNode | null,
  b: ListNode | null,
  hooks: IntersectionHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value === b.value) {
      // 避免重复元素重复加入：仅当 tail 为空或值不同时加入
      if (tail === dummy || tail.value !== a.value) {
        tail.next = { value: a.value, next: null };
        tail = tail.next;
      }
      hooks.onMatch?.(a.value);
      a = a.next;
      b = b.next;
    } else if (a.value < b.value) {
      hooks.onAdvance?.('a');
      a = a.next;
    } else {
      hooks.onAdvance?.('b');
      b = b.next;
    }
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
