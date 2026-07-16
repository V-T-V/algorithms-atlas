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

export interface MergeHooks {
  onAppend?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function mergeSorted(
  a: ListNode | null,
  b: ListNode | null,
  hooks: MergeHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
    hooks.onAppend?.(tail.value);
  }
  tail.next = a ?? b;
  const head = dummy.next;
  hooks.onResult?.(head);
  return head;
}
