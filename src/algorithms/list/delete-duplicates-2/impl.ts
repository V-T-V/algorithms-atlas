// =============================================================================
// 删除排序链表重复元素 II（Remove Duplicates II）· 纯算法实现
// 升序链表，删除所有出现过重复的节点（只保留从未重复的值）。零 DOM 依赖。
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
export interface DeleteDuplicates2Hooks {
  /** 检测到一段重复值（从 dupStart 起至少两个相同）。 */
  onDupRange?: (value: number, dupStart: ListNode) => void;
  /** 删除一整段重复节点（prev.next 跳过它们）。 */
  onDeleteRange?: (value: number) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 删除升序链表中所有出现重复的值（只保留出现一次的值）。
 * 时间 O(n)，空间 O(1)。
 */
export function deleteDuplicates2(
  head: ListNode | null,
  hooks: DeleteDuplicates2Hooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: head };
  let prev = dummy;
  while (prev.next !== null) {
    let cur: ListNode | null = prev.next;
    // 找出与 cur 同值的连续段
    if (cur.next !== null && cur.value === cur.next.value) {
      hooks.onDupRange?.(cur.value, cur);
      const dupVal = cur.value;
      while (cur !== null && cur.value === dupVal) {
        cur = cur.next;
      }
      prev.next = cur; // 删除整段
      hooks.onDeleteRange?.(dupVal);
    } else {
      prev = cur;
    }
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
