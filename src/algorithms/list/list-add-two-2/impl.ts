// =============================================================================
// 两数相加（前置补零法）· 纯算法实现
// =============================================================================

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

export interface AddTwo2Hooks {
  onDigit?: (a: number, b: number, sum: number, carry: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 两条逆序链表相加（前置补零法）。
 */
export function addTwo2(
  a: ListNode | null,
  b: ListNode | null,
  hooks: AddTwo2Hooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  let carry = 0;
  while (a !== null || b !== null || carry !== 0) {
    const da = a !== null ? a.value : 0;
    const db = b !== null ? b.value : 0;
    const sum = da + db + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;
    tail.next = { value: digit, next: null };
    tail = tail.next;
    hooks.onDigit?.(da, db, digit, carry);
    if (a !== null) a = a.next;
    if (b !== null) b = b.next;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
