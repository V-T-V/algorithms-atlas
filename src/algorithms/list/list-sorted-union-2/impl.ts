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

export interface UnionHooks {
  onAdd?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function sortedUnion(
  a: ListNode | null,
  b: ListNode | null,
  hooks: UnionHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  const push = (v: number) => {
    if (tail.value !== v || tail === dummy) {
      tail.next = { value: v, next: null };
      tail = tail.next;
      hooks.onAdd?.(v);
    }
  };
  while (a && b) {
    if (a.value === b.value) {
      push(a.value);
      a = a.next;
      b = b.next;
    } else if (a.value < b.value) {
      push(a.value);
      a = a.next;
    } else {
      push(b.value);
      b = b.next;
    }
  }
  while (a) {
    push(a.value);
    a = a.next;
  }
  while (b) {
    push(b.value);
    b = b.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
