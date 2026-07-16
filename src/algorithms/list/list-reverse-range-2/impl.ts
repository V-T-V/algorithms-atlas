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

export interface RevRangeHooks {
  onMove?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function reverseBetween(
  head: ListNode | null,
  m: number,
  n: number,
  hooks: RevRangeHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  for (let i = 1; i < m; i++) prev = prev.next!;
  const start = prev.next!;
  let then = start.next;
  for (let i = 0; i < n - m; i++) {
    start.next = then!.next;
    then!.next = prev.next;
    prev.next = then;
    hooks.onMove?.(then!.value);
    then = start.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
