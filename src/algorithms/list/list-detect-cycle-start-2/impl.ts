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

export interface CycleStartHooks {
  onMeet?: (slow: number, fast: number) => void;
  onResult?: (v: number | null) => void;
}
export function detectCycleStart(
  head: ListNode | null,
  hooks: CycleStartHooks = {},
): ListNode | null {
  let slow = head,
    fast = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      hooks.onMeet?.(slow!.value, fast!.value);
      let p: ListNode | null = head;
      while (p !== slow) {
        p = p!.next;
        slow = slow!.next;
      }
      hooks.onResult?.(p!.value);
      return p;
    }
  }
  hooks.onResult?.(null);
  return null;
}
