// =============================================================================
// 合并两个有序链表（Merge Two Sorted Lists）· 纯算法实现
// 把两条升序链表合并成一条升序链表。零 DOM 依赖，可独立单测。
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
export interface MergeTwoSortedHooks {
  /** 比较 a、b 当前节点，挑较小者接上。pick='a'|'b'。 */
  onCompare?: (a: ListNode | null, b: ListNode | null, pick: 'a' | 'b') => void;
  /** 计算完成。 */
  onDone?: (head: ListNode | null) => void;
}

/**
 * 合并两条升序链表（复用原节点，哑节点拼接）。
 * 时间 O(m+n)，空间 O(1)。
 */
export function mergeTwoSorted(
  a: ListNode | null,
  b: ListNode | null,
  hooks: MergeTwoSortedHooks = {},
): ListNode | null {
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  while (a !== null && b !== null) {
    if (a.value <= b.value) {
      hooks.onCompare?.(a, b, 'a');
      tail.next = a;
      a = a.next;
    } else {
      hooks.onCompare?.(a, b, 'b');
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  hooks.onDone?.(dummy.next);
  return dummy.next;
}
