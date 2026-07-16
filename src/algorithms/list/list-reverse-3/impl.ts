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

export interface ReverseHooks {
  onFlip?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function reverseList(head: ListNode | null, hooks: ReverseHooks = {}): ListNode | null {
  let prev: ListNode | null = null,
    cur = head;
  while (cur) {
    const nxt = cur.next;
    cur.next = prev;
    hooks.onFlip?.(cur.value);
    prev = cur;
    cur = nxt;
  }
  hooks.onResult?.(prev);
  return prev;
}
