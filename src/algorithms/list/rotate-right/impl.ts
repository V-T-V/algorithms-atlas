// =============================================================================
// 旋转链表（Rotate List）· 纯算法实现
// 把链表每个节点向右移动 k 位。零 DOM 依赖，可独立单测。
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
export interface RotateRightHooks {
  /** 找到断点：newTail 之后即为新头。 */
  onCut?: (newTail: ListNode, newHead: ListNode) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 链表右旋 k 位（k 取模长度）。
 * 时间 O(n)，空间 O(1)。
 */
export function rotateRight(
  head: ListNode | null,
  k: number,
  hooks: RotateRightHooks = {},
): ListNode | null {
  if (head === null || head.next === null || k <= 0) {
    hooks.onDone?.(head);
    return head;
  }
  // 求长度并成环
  let n = 1;
  let tail = head;
  while (tail.next !== null) {
    tail = tail.next;
    n++;
  }
  tail.next = head; // 闭环
  const steps = k % n;
  const newTailSteps = n - steps;
  let newTail = head;
  for (let i = 1; i < newTailSteps; i++) newTail = newTail.next!;
  const newHead = newTail.next!;
  hooks.onCut?.(newTail, newHead);
  newTail.next = null; // 断环
  hooks.onDone?.(newHead);
  return newHead;
}
