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

export interface ZipHooks {
  onAppend?: (v: number, src: 'a' | 'b') => void;
  onResult?: (h: ListNode | null) => void;
}
export function zipLists(
  a: ListNode | null,
  b: ListNode | null,
  hooks: ZipHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy,
    turn = 0;
  while (a && b) {
    if (turn % 2 === 0) {
      tail.next = a;
      a = a.next;
      hooks.onAppend?.(tail.next!.value, 'a');
    } else {
      tail.next = b;
      b = b.next;
      hooks.onAppend?.(tail.next!.value, 'b');
    }
    tail = tail.next;
    turn++;
  }
  tail.next = a ?? b;
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
