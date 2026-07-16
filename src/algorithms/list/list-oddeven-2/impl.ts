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

export interface OddEvenHooks {
  onGroup?: (v: number, side: 'odd' | 'even') => void;
  onResult?: (h: ListNode | null) => void;
}
export function oddEvenList(head: ListNode | null, hooks: OddEvenHooks = {}): ListNode | null {
  if (!head || !head.next) return head;
  let odd = head,
    even = head.next,
    evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next!;
    hooks.onGroup?.(odd.value, 'odd');
    even.next = odd.next;
    even = even.next!;
    if (even) hooks.onGroup?.(even.value, 'even');
  }
  odd.next = evenHead;
  hooks.onResult?.(head);
  return head;
}
