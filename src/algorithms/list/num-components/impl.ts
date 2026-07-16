// =============================================================================
// 链表组件数量（Linked List Components）· 纯算法实现
// 给定链表与值集合 nums，统计链表中「由 nums 中值组成的连续段」数量。
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
export interface NumComponentsHooks {
  /** 访问节点 value，inSet 表示是否在 nums 中。 */
  onVisit?: (value: number, inSet: boolean) => void;
  /** 一个新组件段开始。 */
  onComponent?: (startValue: number) => void;
  /** 计算完成，给出组件数。 */
  onDone?: (count: number) => void;
}

/**
 * 统计链表中由 nums 值组成的连续段（组件）数量。
 * 时间 O(n)，空间 O(|nums|)。
 */
export function numComponents(
  head: ListNode | null,
  nums: readonly number[],
  hooks: NumComponentsHooks = {},
): number {
  const set = new Set<number>(nums);
  let count = 0;
  let cur = head;
  let inComp = false;
  while (cur !== null) {
    const inSet = set.has(cur.value);
    hooks.onVisit?.(cur.value, inSet);
    if (inSet && !inComp) {
      count++;
      hooks.onComponent?.(cur.value);
    }
    inComp = inSet;
    cur = cur.next;
  }
  hooks.onDone?.(count);
  return count;
}
