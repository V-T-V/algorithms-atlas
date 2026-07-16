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

export interface DedupHooks {
  onDrop?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function deleteDuplicates(head: ListNode | null, hooks: DedupHooks = {}): ListNode | null {
  let cur = head;
  while (cur && cur.next) {
    if (cur.value === cur.next.value) {
      hooks.onDrop?.(cur.next.value);
      cur.next = cur.next.next;
    } else cur = cur.next;
  }
  hooks.onResult?.(head);
  return head;
}
