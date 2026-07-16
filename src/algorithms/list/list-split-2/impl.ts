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

export interface SplitHooks {
  onSplit?: (v: number, side: 'lt' | 'ge') => void;
  onResult?: (a: ListNode | null, b: ListNode | null) => void;
}
export function splitByValue(
  head: ListNode | null,
  x: number,
  hooks: SplitHooks = {},
): [ListNode | null, ListNode | null] {
  const ltD: ListNode = { value: NaN, next: null };
  const geD: ListNode = { value: NaN, next: null };
  let lt = ltD,
    ge = geD,
    cur = head;
  while (cur) {
    const side = cur.value < x ? 'lt' : 'ge';
    if (side === 'lt') {
      lt.next = cur;
      lt = cur;
    } else {
      ge.next = cur;
      ge = cur;
    }
    hooks.onSplit?.(cur.value, side);
    cur = cur.next;
  }
  lt.next = null;
  ge.next = null;
  hooks.onResult?.(ltD.next, geD.next);
  return [ltD.next, geD.next];
}
