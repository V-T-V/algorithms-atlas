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

export interface IntersectHooks {
  onStep?: (va: number | null, vb: number | null) => void;
  onResult?: (v: number | null) => void;
}
export function getIntersection(
  headA: ListNode | null,
  headB: ListNode | null,
  hooks: IntersectHooks = {},
): ListNode | null {
  if (!headA || !headB) {
    hooks.onResult?.(null);
    return null;
  }
  let pa: ListNode | null = headA,
    pb: ListNode | null = headB;
  while (pa !== pb) {
    pa = pa ? pa.next : headB;
    pb = pb ? pb.next : headA;
    hooks.onStep?.(pa?.value ?? null, pb?.value ?? null);
  }
  hooks.onResult?.(pa?.value ?? null);
  return pa;
}
