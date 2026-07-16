// =============================================================================
// 删除排序链表重复元素（Remove Duplicates from Sorted List）· 纯算法实现
// 升序链表，删除所有重复节点使每个值只出现一次。零 DOM 依赖，可独立单测。
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
export interface DeleteDuplicatesHooks {
  /** 当前保留节点 cur 与候选 candidate 比较。equal=true 表示重复。 */
  onCompare?: (cur: ListNode | null, candidate: ListNode | null, equal: boolean) => void;
  /** 跳过（删除）一个重复节点。 */
  onSkip?: (skipped: ListNode) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 删除升序链表中的重复元素（每个值只留一个）。
 * 时间 O(n)，空间 O(1)。
 */
export function deleteDuplicates(
  head: ListNode | null,
  hooks: DeleteDuplicatesHooks = {},
): ListNode | null {
  let cur = head;
  while (cur !== null && cur.next !== null) {
    hooks.onCompare?.(cur, cur.next, cur.value === cur.next.value);
    if (cur.value === cur.next.value) {
      const skipped = cur.next;
      hooks.onSkip?.(skipped);
      cur.next = cur.next.next; // 跳过重复
    } else {
      cur = cur.next;
    }
  }
  hooks.onDone?.(head);
  return head;
}
