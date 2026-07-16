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

export interface SwapKHooks {
  onSwap?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function swapNodes(
  head: ListNode | null,
  k: number,
  hooks: SwapKHooks = {},
): ListNode | null {
  let n = 0,
    cur = head;
  while (cur) {
    n++;
    cur = cur.next;
  }
  if (k < 1 || k > n) return head;
  let front: ListNode | null = null,
    back: ListNode | null = null;
  cur = head;
  for (let i = 1; i <= n; i++) {
    if (i === k) front = cur;
    if (i === n - k + 1) back = cur;
    cur = cur!.next;
  }
  if (front && back) {
    const t = front.value;
    front.value = back.value;
    back.value = t;
    hooks.onSwap?.(front.value, back.value);
  }
  hooks.onResult?.(head);
  return head;
}
