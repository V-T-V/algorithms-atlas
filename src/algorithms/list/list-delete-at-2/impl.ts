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

export interface DeleteAtHooks {
  onDelete?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function deleteAt(
  head: ListNode | null,
  k: number,
  hooks: DeleteAtHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy,
    i = 0;
  while (i < k && prev.next) {
    prev = prev.next;
    i++;
  }
  if (prev.next) {
    hooks.onDelete?.(prev.next.value);
    prev.next = prev.next.next;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
