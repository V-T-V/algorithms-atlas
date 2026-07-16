// =============================================================================
// 分隔链表（Partition List）· 纯算法实现
// 把链表按 x 分隔：所有 < x 的节点在前，>= x 的在后，保持原相对顺序。
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
export interface PartitionListHooks {
  /** 处理某节点 value，side='less'|'ge'。 */
  onClassify?: (value: number, side: 'less' | 'ge') => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 分隔链表：小于 x 的放前，大于等于 x 的放后，保持原相对顺序。
 * 用两个哑链表分别收集，最后拼接。
 * 时间 O(n)，空间 O(1)（仅哑节点）。
 */
export function partitionList(
  head: ListNode | null,
  x: number,
  hooks: PartitionListHooks = {},
): ListNode | null {
  const lessDummy: ListNode = { value: NaN, next: null };
  const geDummy: ListNode = { value: NaN, next: null };
  let lessTail = lessDummy;
  let geTail = geDummy;
  let cur = head;
  while (cur !== null) {
    if (cur.value < x) {
      hooks.onClassify?.(cur.value, 'less');
      lessTail.next = cur;
      lessTail = cur;
    } else {
      hooks.onClassify?.(cur.value, 'ge');
      geTail.next = cur;
      geTail = cur;
    }
    cur = cur.next;
  }
  geTail.next = null; // 截断，防环
  lessTail.next = geDummy.next;
  hooks.onDone?.(lessDummy.next);
  return lessDummy.next;
}
