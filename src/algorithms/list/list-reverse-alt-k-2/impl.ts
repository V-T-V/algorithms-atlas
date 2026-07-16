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

export interface RevAltHooks {
  onGroup?: (idx: number, reverse: boolean) => void;
  onResult?: (h: ListNode | null) => void;
}
function reverseSeg(
  start: ListNode | null,
  k: number,
): { head: ListNode | null; tail: ListNode | null; after: ListNode | null } {
  let prev: ListNode | null = null,
    cur = start,
    i = 0;
  while (cur && i < k) {
    const n = cur.next;
    cur.next = prev;
    prev = cur;
    cur = n;
    i++;
  }
  return { head: prev, tail: start, after: cur };
}
export function reverseAltKGroup(
  head: ListNode | null,
  k: number,
  hooks: RevAltHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prevEnd = dummy,
    cur = head,
    gi = 0;
  while (cur) {
    gi++;
    const reverse = gi % 2 === 0;
    hooks.onGroup?.(gi, reverse);
    if (reverse) {
      const seg = reverseSeg(cur, k);
      prevEnd.next = seg.head;
      seg.tail!.next = seg.after;
      prevEnd = seg.tail!;
      cur = seg.after;
    } else {
      let i = 0;
      while (cur && i < k - 1) {
        cur = cur.next;
        i++;
      }
      prevEnd = cur!;
      cur = cur!.next;
    }
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
