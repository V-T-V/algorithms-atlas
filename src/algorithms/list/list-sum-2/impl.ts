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

export interface SumHooks {
  onAcc?: (cur: number, total: number) => void;
  onResult?: (s: number) => void;
}
export function listSum(head: ListNode | null, hooks: SumHooks = {}): number {
  let s = 0,
    cur = head;
  while (cur) {
    s += cur.value;
    hooks.onAcc?.(cur.value, s);
    cur = cur.next;
  }
  hooks.onResult?.(s);
  return s;
}
