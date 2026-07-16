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

export interface CycleHooks {
  onStep?: (slow: number | null, fast: number | null) => void;
  onResult?: (has: boolean) => void;
}
export function hasCycle(head: ListNode | null, hooks: CycleHooks = {}): boolean {
  let slow = head,
    fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    hooks.onStep?.(slow?.value ?? null, fast?.value ?? null);
    if (slow === fast) {
      hooks.onResult?.(true);
      return true;
    }
  }
  hooks.onResult?.(false);
  return false;
}
