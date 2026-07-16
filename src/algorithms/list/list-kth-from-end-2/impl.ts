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

export interface KthEndHooks {
  onArrive?: (v: number) => void;
  onResult?: (v: number | null) => void;
}
export function kthFromEnd(
  head: ListNode | null,
  k: number,
  hooks: KthEndHooks = {},
): number | null {
  let fast = head,
    slow = head;
  for (let i = 0; i < k; i++) {
    if (!fast) {
      hooks.onResult?.(null);
      return null;
    }
    fast = fast.next;
  }
  while (fast) {
    slow = slow!.next;
    fast = fast.next;
  }
  hooks.onArrive?.(slow!.value);
  hooks.onResult?.(slow!.value);
  return slow!.value;
}
