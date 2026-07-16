// =============================================================================
// 链表随机节点（蓄水池）· 纯算法实现
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

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

export interface GetRandomHooks {
  onVisit?: (index: number, value: number) => void;
  onKeep?: (index: number, value: number) => void;
  onDone?: (chosen: number) => void;
}

/**
 * 用蓄水池抽样（容量 1）从链表中均匀随机抽取一个节点值。
 * @param rng 可注入的随机数生成器，返回 [0,1)。
 */
export function getRandom(
  head: ListNode | null,
  hooks: GetRandomHooks = {},
  rng: () => number = Math.random,
): number {
  if (head === null) {
    return NaN;
  }
  let chosen = head.value;
  let cur: ListNode | null = head.next;
  let i = 2;
  while (cur !== null) {
    hooks.onVisit?.(i, cur.value);
    // 以 1/i 概率替换
    if (rng() < 1 / i) {
      chosen = cur.value;
      hooks.onKeep?.(i, cur.value);
    }
    cur = cur.next;
    i++;
  }
  hooks.onDone?.(chosen);
  return chosen;
}
