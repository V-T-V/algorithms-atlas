// =============================================================================
// 两两交换相邻节点 · 纯算法实现
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

export interface SwapAdjacentHooks {
  onSwap?: (aValue: number, bValue: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 两两交换相邻节点（哑节点法）。
 */
export function swapAdjacent(
  head: ListNode | null,
  hooks: SwapAdjacentHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next !== null && prev.next.next !== null) {
    const a = prev.next;
    const b = a.next!;
    a.next = b.next;
    b.next = a;
    prev.next = b;
    hooks.onSwap?.(a.value, b.value);
    prev = a;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
