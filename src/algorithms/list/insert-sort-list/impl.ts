// =============================================================================
// 链表插入排序（Insertion Sort List）· 纯算法实现
// 对单链表做插入排序。零 DOM 依赖，可独立单测。
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
export interface InsertSortListHooks {
  /** 取出待插入节点 cur，在已排序段中找位置。 */
  onPick?: (cur: ListNode) => void;
  /** 把 cur 插入到 prev 之后。 */
  onInsert?: (cur: ListNode, prev: ListNode | null) => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 链表插入排序：每次从剩余部分取一节点，插入到已排序哑链表的正确位置。
 * 时间 O(n^2)，空间 O(1)。
 */
export function insertSortList(
  head: ListNode | null,
  hooks: InsertSortListHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let cur = head;
  while (cur !== null) {
    hooks.onPick?.(cur);
    const next = cur.next;
    // 在已排序段找插入位置（首个 value > cur.value 的前驱）
    let prev: ListNode = dummy;
    while (prev.next !== null && prev.next.value < cur.value) prev = prev.next;
    cur.next = prev.next;
    prev.next = cur;
    hooks.onInsert?.(cur, prev === dummy ? null : prev);
    cur = next;
  }
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
