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

export interface RotLeftHooks {
  onCut?: (v: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function rotateLeft(
  head: ListNode | null,
  k: number,
  hooks: RotLeftHooks = {},
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
  let cur = head;
  for (let i = 1; i < k; i++) cur = cur.next!;
  const newHead = cur.next!;
  cur.next = null;
  tail.next = head;
  hooks.onCut?.(cur.value);
  hooks.onResult?.(newHead);
  return newHead;
}
