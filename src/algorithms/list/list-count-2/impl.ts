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

export interface CountHooks {
  onVisit?: (i: number, v: number) => void;
  onResult?: (n: number) => void;
}
export function countList(head: ListNode | null, hooks: CountHooks = {}): number {
  let n = 0,
    cur = head;
  while (cur) {
    hooks.onVisit?.(n, cur.value);
    n++;
    cur = cur.next;
  }
  hooks.onResult?.(n);
  return n;
}
