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

export interface PartHooks {
  onMove?: (v: number, side: 'lt' | 'ge') => void;
  onResult?: (h: ListNode | null) => void;
}
export function partition(
  head: ListNode | null,
  x: number,
  hooks: PartHooks = {},
): ListNode | null {
  const ltD: ListNode = { value: NaN, next: null };
  const geD: ListNode = { value: NaN, next: null };
  let lt = ltD,
    ge = geD,
    cur = head;
  while (cur) {
    if (cur.value < x) {
      lt.next = cur;
      lt = cur;
      hooks.onMove?.(cur.value, 'lt');
    } else {
      ge.next = cur;
      ge = cur;
      hooks.onMove?.(cur.value, 'ge');
    }
    cur = cur.next;
  }
  ge.next = null;
  lt.next = geD.next;
  const h = ltD.next;
  hooks.onResult?.(h);
  return h;
}
