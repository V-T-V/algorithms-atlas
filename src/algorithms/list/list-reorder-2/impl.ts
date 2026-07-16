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

export interface ReorderHooks {
  onMerge?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
function reverse(h: ListNode | null): ListNode | null {
  let p: ListNode | null = null,
    c = h;
  while (c) {
    const n = c.next;
    c.next = p;
    p = c;
    c = n;
  }
  return p;
}
export function reorderList(head: ListNode | null, hooks: ReorderHooks = {}): void {
  if (!head || !head.next) return;
  let slow = head,
    fast = head.next;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next!.next!;
  }
  let second = reverse(slow.next!);
  slow.next = null;
  let first = head;
  while (second) {
    const f1 = first.next,
      s1 = second.next;
    first.next = second;
    second.next = f1;
    hooks.onMerge?.(first.value, second.value);
    first = f1!;
    second = s1;
  }
  hooks.onResult?.(head);
}
