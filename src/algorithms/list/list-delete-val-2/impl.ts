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

export interface RemoveValHooks {
  onRemove?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function removeElements(
  head: ListNode | null,
  x: number,
  hooks: RemoveValHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy,
    cur = head;
  while (cur) {
    if (cur.value === x) {
      prev.next = cur.next;
      hooks.onRemove?.(cur.value);
    } else prev = cur;
    cur = cur.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
