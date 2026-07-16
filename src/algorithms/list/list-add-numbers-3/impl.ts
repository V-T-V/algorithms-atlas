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

export interface AddNumHooks {
  onDigit?: (d: number, carry: number) => void;
  onResult?: (h: ListNode | null) => void;
}
export function addTwoNumbers(
  a: ListNode | null,
  b: ListNode | null,
  hooks: AddNumHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy,
    carry = 0;
  while (a || b || carry) {
    const sum = (a ? a.value : 0) + (b ? b.value : 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = { value: sum % 10, next: null };
    tail = tail.next;
    hooks.onDigit?.(tail.value, carry);
    a = a ? a.next : null;
    b = b ? b.next : null;
  }
  const h = dummy.next;
  hooks.onResult?.(h);
  return h;
}
