// 递归链表求和 · 纯算法实现

export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 从数组构建单链表。 */
export function buildList(values: readonly number[]): ListNode | null {
  if (values.length === 0) return null;
  const head: ListNode = { value: values[0]!, next: null };
  let cur = head;
  for (let i = 1; i < values.length; i++) {
    cur.next = { value: values[i]!, next: null };
    cur = cur.next;
  }
  return head;
}

/** 把链表转回数组（便于测试/可视化）。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur !== null) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/** 事件钩子。 */
export interface ListSumHooks {
  /** 进入某节点（给出值与深度）。 */
  onVisit?: (value: number, depth: number) => void;
  /** 到达链表末尾（基线）。 */
  onBase?: (depth: number) => void;
  /** 某层返回（给出该节点值与本层返回的部分和）。 */
  onReturn?: (value: number, partialSum: number, depth: number) => void;
}

/**
 * 递归链表求和。
 */
export function listSum(
  head: ListNode | null,
  hooks: ListSumHooks = {},
  depth: number = 0,
): number {
  if (head === null) {
    hooks.onBase?.(depth);
    return 0;
  }
  hooks.onVisit?.(head.value, depth);
  const restSum = listSum(head.next, hooks, depth + 1);
  const total = head.value + restSum;
  hooks.onReturn?.(head.value, total, depth);
  return total;
}
