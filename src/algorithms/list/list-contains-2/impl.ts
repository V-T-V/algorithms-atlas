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

export interface ContainsHooks {
  onCompare?: (v: number, hit: boolean) => void;
  onResult?: (found: boolean) => void;
}
export function containsValue(
  head: ListNode | null,
  x: number,
  hooks: ContainsHooks = {},
): boolean {
  let cur = head;
  while (cur) {
    const hit = cur.value === x;
    hooks.onCompare?.(cur.value, hit);
    if (hit) {
      hooks.onResult?.(true);
      return true;
    }
    cur = cur.next;
  }
  hooks.onResult?.(false);
  return false;
}
