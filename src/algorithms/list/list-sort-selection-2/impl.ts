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

export interface SelHooks {
  onSwap?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function selectionSortList(head: ListNode | null, hooks: SelHooks = {}): ListNode | null {
  let cur = head;
  while (cur) {
    let minNode = cur,
      scan = cur.next;
    while (scan) {
      if (scan.value < minNode.value) minNode = scan;
      scan = scan.next;
    }
    if (minNode !== cur) {
      const t = cur.value;
      cur.value = minNode.value;
      minNode.value = t;
      hooks.onSwap?.(cur.value, minNode.value);
    }
    cur = cur.next;
  }
  hooks.onResult?.(head);
  return head;
}
