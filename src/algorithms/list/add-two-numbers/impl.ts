// =============================================================================
// 两数相加（链表） · 纯算法实现
// 两个非空链表逆序存储两个非负整数，返回表示和的逆序链表。
// =============================================================================

export interface ListNode {
  val: number;
  next: ListNode | null;
}

/** 从数组构建逆序链表（数组即逆序后的数字位，如 [2,4,3] = 342）。 */
export function fromArray(arr: readonly number[]): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let cur = dummy;
  for (const v of arr) {
    cur.next = { val: v, next: null };
    cur = cur.next;
  }
  return dummy.next;
}

/** 链表转数组。 */
export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

export interface AddTwoNumbersHooks {
  onAddDigit?: (
    v1: number | undefined,
    v2: number | undefined,
    carry: number,
    resultDigit: number,
  ) => void;
}

/**
 * 逆序链表表示的两数相加。
 * @param l1 第一个数（逆序链表，如 [2,4,3] 表示 342）
 * @param l2 第二个数
 * @returns 和的逆序链表
 */
export function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
  hooks: AddTwoNumbersHooks = {},
): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const v1 = l1?.val ?? 0;
    const v2 = l2?.val ?? 0;
    const sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;
    cur.next = { val: digit, next: null };
    cur = cur.next;
    hooks.onAddDigit?.(l1?.val, l2?.val, carry, digit);
    l1 = l1?.next ?? null;
    l2 = l2?.next ?? null;
  }
  return dummy.next;
}
