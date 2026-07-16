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

export interface RemoveNthHooks {
  onRemove?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function removeNthEnd(
  head: ListNode | null,
  n: number,
  hooks: RemoveNthHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let fast: ListNode | null = head;
  for (let i = 0; i < n; i++) fast = fast ? fast.next : null;
  let slow = dummy;
  while (fast) {
    slow = slow.next!;
    fast = fast.next;
  }
  const target = slow.next;
  if (target) hooks.onRemove?.(target.value);
  slow.next = target ? target.next : null;
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
