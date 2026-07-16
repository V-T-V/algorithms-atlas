// =============================================================================
// 原地合并有序链表（Merge Sorted Lists In-Place）· 纯算法实现
// 哑节点 + 双指针，复用原节点不开新节点。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

export interface MergeInPlaceHooks {
  /** 比较 l1 与 l2 当前节点，选择较小者。 */
  onCompare?: (v1: number, v2: number, pick: 1 | 2) => void;
  /** 把节点 node 接到结果尾。 */
  onAppend?: (node: ListNode) => void;
  /** 一条链已耗尽，把另一条整体接到尾。 */
  onSplice?: (fromList: 1 | 2, head: ListNode | null) => void;
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
 * 原地合并两条非降序链表，复用原节点。
 * 时间 O(n+m)，空间 O(1)（仅哑节点）。
 */
export function mergeSortedInPlace(
  l1: ListNode | null,
  l2: ListNode | null,
  hooks: MergeInPlaceHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail: ListNode = dummy;

  while (l1 !== null && l2 !== null) {
    const pick: 1 | 2 = l1.value <= l2.value ? 1 : 2;
    hooks.onCompare?.(l1.value, l2.value, pick);
    if (pick === 1) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    hooks.onAppend?.(tail.next);
    tail = tail.next;
  }
  // 接上剩余
  const restHead = l1 !== null ? l1 : l2;
  if (restHead !== null) {
    hooks.onSplice?.(l1 !== null ? 1 : 2, restHead);
  }
  tail.next = restHead;

  return dummy.next;
}
