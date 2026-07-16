// =============================================================================
// 按值分割链表 · 纯算法实现
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

export interface SplitResult {
  left: ListNode | null;
  right: ListNode | null;
}

export interface SplitByValueHooks {
  onSplit?: (left: ListNode | null, right: ListNode | null) => void;
}

/**
 * 按值 pivot 把链表分为 < pivot 与 >= pivot 两段（保持相对顺序）。
 */
export function splitByValue(
  head: ListNode | null,
  pivot: number,
  hooks: SplitByValueHooks = {},
): SplitResult {
  const leftDummy: ListNode = { value: NaN, next: null };
  const rightDummy: ListNode = { value: NaN, next: null };
  let lt = leftDummy;
  let ge = rightDummy;
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;
    cur.next = null;
    if (cur.value < pivot) {
      lt.next = cur;
      lt = cur;
    } else {
      ge.next = cur;
      ge = cur;
    }
    cur = nxt;
  }
  const result: SplitResult = { left: leftDummy.next, right: rightDummy.next };
  hooks.onSplit?.(result.left, result.right);
  return result;
}
