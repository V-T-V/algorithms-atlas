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

export interface PalHooks {
  onCompare?: (a: number, b: number) => void;
  onResult?: (p: boolean) => void;
}
function reverse(h: ListNode | null): ListNode | null {
  let prev: ListNode | null = null,
    cur = h;
  while (cur) {
    const n = cur.next;
    cur.next = prev;
    prev = cur;
    cur = n;
  }
  return prev;
}
export function isPalindrome(head: ListNode | null, hooks: PalHooks = {}): boolean {
  if (!head || !head.next) {
    hooks.onResult?.(true);
    return true;
  }
  let slow = head,
    fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  const second = reverse(slow.next);
  let p1 = head,
    p2 = second;
  let ok = true;
  while (p2) {
    hooks.onCompare?.(p1.value, p2.value);
    if (p1.value !== p2.value) ok = false;
    p1 = p1.next!;
    p2 = p2.next;
  }
  slow.next = reverse(second); // 恢复
  hooks.onResult?.(ok);
  return ok;
}
