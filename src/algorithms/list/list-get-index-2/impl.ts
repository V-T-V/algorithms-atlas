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

export interface GetIdxHooks {
  onVisit?: (i: number, v: number) => void;
  onResult?: (v: number | null) => void;
}
export function getAt(head: ListNode | null, k: number, hooks: GetIdxHooks = {}): number | null {
  let cur = head,
    i = 0;
  while (cur) {
    hooks.onVisit?.(i, cur.value);
    if (i === k) {
      hooks.onResult?.(cur.value);
      return cur.value;
    }
    cur = cur.next;
    i++;
  }
  hooks.onResult?.(null);
  return null;
}
