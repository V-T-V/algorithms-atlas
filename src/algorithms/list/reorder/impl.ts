// =============================================================================
// 重排链表（Reorder List）· 纯算法实现
// L0→Ln→L1→Ln-1→L2→Ln-2→… 三步：找中点、反转后半、交错合并。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
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

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ReorderHooks {
  /** 找到中点 mid。 */
  onMid?: (mid: ListNode) => void;
  /** 反转后半段完成。 */
  onReverse?: (secondHead: ListNode | null) => void;
  /** 交错合并：把 b 接到 a 之后。 */
  onMerge?: (a: ListNode, b: ListNode) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/** 反转链表，返回新头。 */
function reverse(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur !== null) {
    const nxt = cur.next;
    cur.next = prev;
    prev = cur;
    cur = nxt;
  }
  return prev;
}

/**
 * 原地重排链表：L0,Ln,L1,Ln-1,...
 * 时间 O(n)，空间 O(1)。
 */
export function reorder(head: ListNode | null, hooks: ReorderHooks = {}): ListNode | null {
  if (head === null || head.next === null) {
    hooks.onDone?.(head);
    return head;
  }
  // 1) 快慢指针找中点（slow 在前半末尾）
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  hooks.onMid?.(slow!);
  // 2) 反转后半
  let second: ListNode | null = reverse(slow!.next);
  slow!.next = null;
  hooks.onReverse?.(second);
  // 3) 交错合并 first 与 second
  let first: ListNode | null = head;
  while (second !== null) {
    const fNext: ListNode | null = first!.next;
    const sNext: ListNode | null = second.next;
    first!.next = second;
    second.next = fNext;
    hooks.onMerge?.(first!, second);
    first = fNext;
    second = sNext;
  }
  hooks.onDone?.(head);
  return head;
}
