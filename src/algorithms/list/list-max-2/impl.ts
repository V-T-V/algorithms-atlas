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

export interface MaxHooks {
  onCompare?: (cur: number, best: number) => void;
  onResult?: (m: number | null) => void;
}
export function listMax(head: ListNode | null, hooks: MaxHooks = {}): number | null {
  if (!head) {
    hooks.onResult?.(null);
    return null;
  }
  let best = head.value,
    cur = head.next;
  while (cur) {
    hooks.onCompare?.(cur.value, best);
    if (cur.value > best) best = cur.value;
    cur = cur.next;
  }
  hooks.onResult?.(best);
  return best;
}
