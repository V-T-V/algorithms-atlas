// =============================================================================
// 反转链表（Reverse Linked List）· 纯算法实现
// 零 DOM 依赖，可独立单测。提供迭代版与递归版，通过「钩子」暴露指针翻转步骤。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 算法执行过程中的事件钩子（迭代版）。任一可选。 */
export interface ReverseListHooks {
  /** 进入某节点 curr，当前 prev / curr / next 三指针状态。 */
  onFlip?: (prev: ListNode | null, curr: ListNode | null, next: ListNode | null) => void;
  /** 链表头已切换为 newHead。 */
  onDone?: (newHead: ListNode | null) => void;
}

/** 从数值数组构建单链表，返回头节点。 */
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

/** 把链表拍平成数值数组（便于断言）。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/**
 * 迭代反转链表：三指针 prev/curr/next 逐节点翻向。
 * 时间 O(n)，空间 O(1)。
 */
export function reverseList(head: ListNode | null, hooks: ReverseListHooks = {}): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const next: ListNode | null = curr.next;
    curr.next = prev; // 翻转指针
    hooks.onFlip?.(prev, curr, next);
    prev = curr;
    curr = next;
  }
  hooks.onDone?.(prev);
  return prev;
}

/**
 * 递归反转链表：先反转后续链表，再把当前节点接到反转后链表尾部。
 * 时间 O(n)，空间 O(n)（递归栈）。
 */
export function reverseListRecursive(head: ListNode | null): ListNode | null {
  if (head === null || head.next === null) return head;
  const newHead = reverseListRecursive(head.next);
  // head.next 是反转后子链表的尾节点
  head.next!.next = head;
  head.next = null;
  return newHead;
}
