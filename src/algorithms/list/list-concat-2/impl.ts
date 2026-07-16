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

export interface ConcatHooks {
  onAppend?: (bv: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function concatList(
  a: ListNode | null,
  b: ListNode | null,
  hooks: ConcatHooks = {},
): ListNode | null {
  if (!a) return b;
  let cur = a;
  while (cur.next) cur = cur.next;
  cur.next = b;
  let c = b;
  while (c) {
    hooks.onAppend?.(c.value);
    c = c.next;
  }
  hooks.onResult?.(a);
  return a;
}
