// =============================================================================
// 回文链表（快慢+反转后半）· 纯算法实现
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

export interface IsPalindrome2Hooks {
  onMid?: (midValue: number) => void;
  onReverse?: (secondHalfHead: number) => void;
  onCompare?: (a: number, b: number, ok: boolean) => void;
  onDone?: (result: boolean) => void;
}

function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}

/**
 * 判断链表是否为回文（O(1) 空间）。
 */
export function isPalindrome2(head: ListNode | null, hooks: IsPalindrome2Hooks = {}): boolean {
  if (head === null || head.next === null) {
    hooks.onDone?.(true);
    return true;
  }
  // 快慢找中点（偶数时停在左半段末尾）
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  hooks.onMid?.(slow!.value);

  const secondHead = reverse(slow!.next);
  hooks.onReverse?.(secondHead!.value);

  let p1: ListNode | null = head;
  let p2 = secondHead;
  let ok = true;
  while (p2 !== null) {
    if (p1!.value !== p2.value) ok = false;
    hooks.onCompare?.(p1!.value, p2.value, p1!.value === p2.value);
    p1 = p1!.next;
    p2 = p2.next;
  }
  // 恢复原结构（可选）
  slow!.next = reverse(secondHead);
  hooks.onDone?.(ok);
  return ok;
}
