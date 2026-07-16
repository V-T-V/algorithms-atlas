// =============================================================================
// 删除倒数第 N 个节点 Remove Nth From End · 纯算法实现
// 双指针：fast 先走 n 步，再 fast/slow 同步前进；fast 到尾时 slow 恰在待删前驱。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** 单链表节点。 */
export interface ListNode {
  value: number;
  next: ListNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RemoveNthEndHooks {
  /** fast 先走 n 步的初始化阶段，每走一步触发。 */
  onFastAdvance?: (fastIdx: number) => void;
  /** fast 与 slow 同步前进，每走一步触发。 */
  onStep?: (slowIdx: number, fastIdx: number) => void;
  /** 定位到待删节点的前驱 slowIdx 与待删节点 targetIdx。 */
  onTarget?: (slowIdx: number, targetIdx: number) => void;
  /** 删除完成，被删节点的值。 */
  onRemoved?: (value: number) => void;
}

/** 从数值数组构建单链表。 */
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

/** 把链表拍平成数值数组。 */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}

/**
 * 删除链表倒数第 n 个节点（n 从 1 开始），返回新头。
 * 用哑节点（dummy）统一处理删除头节点的情况。
 * 时间 O(n)，空间 O(1)。
 */
export function removeNthEnd(
  head: ListNode | null,
  n: number,
  hooks: RemoveNthEndHooks = {},
): ListNode | null {
  if (!head || n <= 0) return head;
  const dummy: ListNode = { value: NaN, next: head };
  let fast: ListNode | null = dummy;
  let slow: ListNode | null = dummy;

  // 1. fast 先走 n 步（走到第 n 个节点）
  let fastIdx = -1; // dummy 为 -1
  for (let i = 0; i < n; i++) {
    fast = fast!.next;
    fastIdx++;
    hooks.onFastAdvance?.(fastIdx);
  }

  // 2. fast/slow 同步前进，直到 fast.next 为 null
  let slowIdx = -1;
  while (fast!.next !== null) {
    fast = fast!.next;
    slow = slow!.next;
    fastIdx++;
    slowIdx++;
    hooks.onStep?.(slowIdx, fastIdx);
  }

  // 3. slow.next 即待删节点
  const target = slow!.next;
  const targetIdx = slowIdx + 1;
  hooks.onTarget?.(slowIdx, targetIdx);
  if (target !== null) {
    slow!.next = target.next;
    target.next = null;
    hooks.onRemoved?.(target.value);
  }

  return dummy.next;
}
