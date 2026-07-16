// =============================================================================
// 奇偶链表（Odd Even Linked List）· 纯算法实现
// 把奇数位节点放前、偶数位节点放后（按 1-based 下标），保持相对顺序。
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
export interface OddEvenListHooks {
  /** 处理第 idx（1-based）个节点，parity='odd'|'even'。 */
  onVisit?: (idx: number, value: number, parity: 'odd' | 'even') => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 奇偶链表重排：所有奇数位节点在前，偶数位节点在后，保持原相对顺序。
 * 时间 O(n)，空间 O(1)。
 */
export function oddEvenList(head: ListNode | null, hooks: OddEvenListHooks = {}): ListNode | null {
  if (head === null) {
    hooks.onDone?.(null);
    return null;
  }
  const oddHead = head;
  const evenHead = head.next;
  let odd = oddHead;
  let even = evenHead;
  let idx = 1;
  while (even !== null && even.next !== null) {
    hooks.onVisit?.(idx, odd.value, 'odd');
    idx++;
    odd.next = even.next;
    odd = odd.next;
    hooks.onVisit?.(idx, even.value, 'even');
    idx++;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead; // 偶链接在奇链后
  hooks.onDone?.(oddHead);
  return oddHead;
}
