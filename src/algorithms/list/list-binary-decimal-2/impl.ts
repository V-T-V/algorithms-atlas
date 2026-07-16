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

export interface BinHooks {
  onStep?: (bit: number, acc: number) => void;
  onResult?: (v: number) => void;
}
export function binaryToDecimal(head: ListNode | null, hooks: BinHooks = {}): number {
  let ans = 0,
    cur = head;
  while (cur) {
    ans = ans * 2 + cur.value;
    hooks.onStep?.(cur.value, ans);
    cur = cur.next;
  }
  hooks.onResult?.(ans);
  return ans;
}
