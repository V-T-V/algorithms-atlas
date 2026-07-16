// =============================================================================
// 两数相加 II（Add Two Numbers II，正向存储）· 纯算法实现
// 用两个栈对齐到尾，逐位相加带进位，头插法建结果。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

export interface AddTwoNumbers2Hooks {
  /** 压栈：把节点压入第 list 条链表的栈。 */
  onPush?: (list: 1 | 2, value: number) => void;
  /** 逐位相加：两位 v1、v2 + 进位 carry → 本位 digit、新进位 carry。 */
  onAddDigit?: (v1: number, v2: number, carry: number, digit: number) => void;
  /** 头插：把新位 digit 插到结果链头。 */
  onPrepend?: (digit: number) => void;
}

/** 从数组构建链表（数组顺序 = 高位到低位）。 */
export function fromArray(arr: readonly number[]): ListNode | null {
  if (arr.length === 0) return null;
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  for (const v of arr) {
    tail.next = { value: v, next: null };
    tail = tail.next;
  }
  return dummy.next;
}

/** 链表转数组。 */
export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 把链表节点依次压栈（返回值的栈，栈顶为低位）。 */
function pushStack(head: ListNode | null, list: 1 | 2, hooks: AddTwoNumbers2Hooks): number[] {
  const stack: number[] = [];
  let cur = head;
  while (cur !== null) {
    stack.push(cur.value);
    hooks.onPush?.(list, cur.value);
    cur = cur.next;
  }
  return stack;
}

/**
 * 两数相加 II：正向存储相加，返回正向存储的和链表。
 * 时间 O(max(m,n))，空间 O(m+n)（两个栈）。
 */
export function addTwoNumbers2(
  l1: ListNode | null,
  l2: ListNode | null,
  hooks: AddTwoNumbers2Hooks = {},
): ListNode | null {
  const s1 = pushStack(l1, 1, hooks);
  const s2 = pushStack(l2, 2, hooks);

  let carry = 0;
  let head: ListNode | null = null;

  while (s1.length > 0 || s2.length > 0 || carry > 0) {
    const v1 = s1.length > 0 ? (s1.pop() ?? 0) : 0;
    const v2 = s2.length > 0 ? (s2.pop() ?? 0) : 0;
    const sum = v1 + v2 + carry;
    carry = Math.floor(sum / 10);
    const digit = sum % 10;
    hooks.onAddDigit?.(v1, v2, carry, digit);

    // 头插：新节点作新头
    const node: ListNode = { value: digit, next: head };
    head = node;
    hooks.onPrepend?.(digit);
  }

  return head;
}
