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

export interface IntersectHooks2 {
  onMatch?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function sortedIntersect(
  a: ListNode | null,
  b: ListNode | null,
  hooks: IntersectHooks2 = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.value === b.value) {
      tail.next = { value: a.value, next: null };
      tail = tail.next;
      hooks.onMatch?.(a.value);
      a = a.next;
      b = b.next;
    } else if (a.value < b.value) a = a.next;
    else b = b.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
