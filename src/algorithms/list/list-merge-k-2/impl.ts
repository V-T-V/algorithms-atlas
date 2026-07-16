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

export interface MergeKHooks {
  onMerge?: (a: number, b: number) => void;
  onResult?: (h: ListNode | null) => void;
}
function merge(a: ListNode | null, b: ListNode | null): ListNode | null {
  const d: ListNode = { value: NaN, next: null };
  let t = d;
  while (a && b) {
    if (a.value <= b.value) {
      t.next = a;
      a = a.next;
    } else {
      t.next = b;
      b = b.next;
    }
    t = t.next;
  }
  t.next = a ?? b;
  return d.next;
}
export function mergeKLists(
  lists: Array<ListNode | null>,
  hooks: MergeKHooks = {},
): ListNode | null {
  let res: ListNode | null = null;
  for (const l of lists) {
    if (res && l) hooks.onMerge?.(res.value, l.value);
    res = merge(res, l);
  }
  hooks.onResult?.(res);
  return res;
}
