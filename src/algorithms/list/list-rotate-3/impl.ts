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

export interface RotateHooks {
  onCut?: (cutVal: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function rotateRight(
  head: ListNode | null,
  k: number,
  hooks: RotateHooks = {},
): ListNode | null {
  if (!head || !head.next || k === 0) return head;
  let n = 1,
    tail = head;
  while (tail.next) {
    tail = tail.next;
    n++;
  }
  k = ((k % n) + n) % n;
  if (k === 0) return head;
  tail.next = head;
  let steps = n - k;
  let cur = tail;
  while (steps > 0) {
    cur = cur.next!;
    steps--;
  }
  const newHead = cur.next!;
  hooks.onCut?.(cur.value);
  cur.next = null;
  hooks.onResult?.(newHead);
  return newHead;
}
