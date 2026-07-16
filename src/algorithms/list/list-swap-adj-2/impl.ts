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

export interface SwapAdjHooks {
  onSwap?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function swapPairs(head: ListNode | null, hooks: SwapAdjHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next,
      b = a.next!;
    a.next = b.next;
    b.next = a;
    prev.next = b;
    hooks.onSwap?.(a.value, b.value);
    prev = a;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
