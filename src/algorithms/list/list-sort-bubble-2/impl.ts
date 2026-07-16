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

export interface BubbleHooks {
  onSwap?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function bubbleSortList(head: ListNode | null, hooks: BubbleHooks = {}): ListNode | null {
  if (!head) return null;
  let swapped = true;
  while (swapped) {
    swapped = false;
    let cur = head;
    while (cur && cur.next) {
      if (cur.value > cur.next.value) {
        const t = cur.value;
        cur.value = cur.next.value;
        cur.next.value = t;
        hooks.onSwap?.(cur.value, cur.next.value);
        swapped = true;
      }
      cur = cur.next;
    }
  }
  hooks.onResult?.(head);
  return head;
}
