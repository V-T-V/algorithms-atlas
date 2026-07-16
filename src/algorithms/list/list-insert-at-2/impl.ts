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

export interface InsertHooks {
  onInsert?: (i: number, v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function insertAt(
  head: ListNode | null,
  k: number,
  x: number,
  hooks: InsertHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy,
    i = 0;
  while (i < k && prev.next) {
    prev = prev.next;
    i++;
  }
  if (i < k) return dummy.next; // 越界不插
  const node: ListNode = { value: x, next: prev.next };
  prev.next = node;
  hooks.onInsert?.(k, x);
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
