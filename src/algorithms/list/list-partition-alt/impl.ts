// =============================================================================
// 分隔链表（双链变种）· 纯算法实现
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

export interface PartitionAltHooks {
  onDispatch?: (value: number, side: 'less' | 'geq') => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 把链表中值 < x 的节点放在前面，>= x 的节点放在后面，保持相对顺序。
 */
export function partitionAlt(
  head: ListNode | null,
  x: number,
  hooks: PartitionAltHooks = {},
): ListNode | null {
  const lessDummy: ListNode = { value: NaN, next: null };
  const geqDummy: ListNode = { value: NaN, next: null };
  let lessTail = lessDummy;
  let geqTail = geqDummy;
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;
    cur.next = null;
    if (cur.value < x) {
      lessTail.next = cur;
      lessTail = cur;
      hooks.onDispatch?.(cur.value, 'less');
    } else {
      geqTail.next = cur;
      geqTail = cur;
      hooks.onDispatch?.(cur.value, 'geq');
    }
    cur = nxt;
  }
  lessTail.next = geqDummy.next;
  hooks.onDone?.(lessDummy.next);
  return lessDummy.next;
}
