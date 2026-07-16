// =============================================================================
// 链表排序 Sort List · 纯算法实现
// 归并排序：快慢指针找中点 → 分割 → 递归排序两半 → 合并。
// =============================================================================

export interface ListNode {
  val: number;
  next: ListNode | null;
}

export function fromArray(arr: readonly number[]): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let cur = dummy;
  for (const v of arr) {
    cur.next = { val: v, next: null };
    cur = cur.next;
  }
  return dummy.next;
}

export function toArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.val);
    cur = cur.next;
  }
  return out;
}

export interface SortListHooks {
  onSplit?: (mid: number) => void;
  onMergeStep?: (leftVal: number, rightVal: number, picked: 'left' | 'right') => void;
}

/**
 * 链表归并排序，返回有序链表头。时间 O(n log n)，空间 O(log n)（递归栈）。
 */
export function sortList(head: ListNode | null, hooks: SortListHooks = {}): ListNode | null {
  if (!head || !head.next) return head;

  // 快慢指针找中点
  let slow = head;
  let fast = head.next;
  let midIdx = 0;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next!;
    midIdx++;
  }
  hooks.onSplit?.(midIdx);

  const mid = slow.next;
  slow.next = null; // 断开

  const left = sortList(head, hooks);
  const right = sortList(mid, hooks);
  return merge(left, right, hooks);
}

/** 合并两个有序链表。 */
function merge(l1: ListNode | null, l2: ListNode | null, hooks: SortListHooks): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      hooks.onMergeStep?.(l1.val, l2.val, 'left');
      cur.next = l1;
      l1 = l1.next;
    } else {
      hooks.onMergeStep?.(l1.val, l2.val, 'right');
      cur.next = l2;
      l2 = l2.next;
    }
    cur = cur.next;
  }
  cur.next = l1 ?? l2;
  return dummy.next;
}
