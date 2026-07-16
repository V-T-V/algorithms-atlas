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

export interface ReverseGroupHooks {
  onGroup?: (start: number) => void;
  onResult?: (h: ListNode | null) => void;
}
function reverseOne(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null,
    cur = head;
  while (cur) {
    const n = cur.next;
    cur.next = prev;
    prev = cur;
    cur = n;
  }
  return prev;
}
export function reverseKGroup(
  head: ListNode | null,
  k: number,
  hooks: ReverseGroupHooks = {},
): ListNode | null {
  let n = 0,
    cur = head;
  while (cur) {
    n++;
    cur = cur.next;
  }
  const dummy: ListNode = { value: NaN, next: head };
  let prevGroupEnd = dummy;
  cur = head;
  while (n >= k) {
    const groupStart = cur;
    let prev: ListNode | null = null;
    for (let i = 0; i < k; i++) {
      const nx = cur!.next;
      cur!.next = prev;
      prev = cur;
      cur = nx;
    }
    hooks.onGroup?.(groupStart!.value);
    prevGroupEnd.next = prev;
    groupStart!.next = cur;
    prevGroupEnd = groupStart!;
    n -= k;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
