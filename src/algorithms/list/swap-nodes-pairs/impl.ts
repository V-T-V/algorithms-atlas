// =============================================================================
// 两两交换链表节点（Swap Nodes in Pairs）· 纯算法实现
// 交换相邻节点本身（重连 next），不交换值。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

export interface SwapPairsHooks {
  /** 交换相邻对 a、b。 */
  onSwap?: (a: ListNode, b: ListNode) => void;
  /** 剩余单个节点，保持不动。 */
  onSingleLeft?: (node: ListNode) => void;
}

/** 从数组构建链表。 */
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

/** 拍平成数组。 */
export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/**
 * 两两交换链表节点（交换节点本身，重连 next）。
 * 时间 O(n)，空间 O(1)。
 */
export function swapPairs(head: ListNode | null, hooks: SwapPairsHooks = {}): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev: ListNode = dummy;

  while (prev.next !== null && prev.next.next !== null) {
    const a = prev.next;
    const b = prev.next.next;
    const after = b.next;

    // 重连：prev → b → a → after
    prev.next = b;
    b.next = a;
    a.next = after;
    hooks.onSwap?.(a, b);

    prev = a; // 推进
  }
  if (prev.next !== null) {
    hooks.onSingleLeft?.(prev.next);
  }
  return dummy.next;
}
