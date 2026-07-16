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

export interface DelAllDupHooks {
  onDrop?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function deleteAllDuplicates(
  head: ListNode | null,
  hooks: DelAllDupHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next && prev.next.next) {
    if (prev.next.value === prev.next.next.value) {
      const dup = prev.next.value;
      while (prev.next && prev.next.value === dup) {
        hooks.onDrop?.(prev.next.value);
        prev.next = prev.next.next;
      }
    } else prev = prev.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
