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

export interface ToArrHooks {
  onPush?: (i: number, v: number) => void;
  onResult?: (arr: number[]) => void;
}
export function toArray(head: ListNode | null, hooks: ToArrHooks = {}): number[] {
  const arr: number[] = [];
  let cur = head,
    i = 0;
  while (cur) {
    arr.push(cur.value);
    hooks.onPush?.(i, cur.value);
    cur = cur.next;
    i++;
  }
  hooks.onResult?.(arr);
  return arr;
}
