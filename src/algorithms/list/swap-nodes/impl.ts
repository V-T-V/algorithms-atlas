// =============================================================================
// 两两交换节点（Swap Nodes in Pairs）· 纯算法实现
// 相邻节点两两交换：A→B→C→D → B→A→D→C。零 DOM 依赖，可独立单测。
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
export interface SwapNodesHooks {
  /** 交换一对相邻节点 a、b。 */
  onSwap?: (a: ListNode, b: ListNode) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 两两交换链表中相邻节点。
 * 时间 O(n)，空间 O(1)。
 */
export function swapNodes(head: ListNode | null, hooks: SwapNodesHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next !== null && prev.next.next !== null) {
    const a = prev.next;
    const b = a.next!;
    // 交换：prev->b->a->b.next
    a.next = b.next;
    b.next = a;
    prev.next = b;
    hooks.onSwap?.(a, b);
    prev = a; // a 现在是这对的后一个
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
