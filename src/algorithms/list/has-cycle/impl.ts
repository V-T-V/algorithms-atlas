// =============================================================================
// 判断链表有环（Linked List Cycle）· 纯算法实现
// 快慢指针 O(n) 检测是否有环。零 DOM 依赖，可独立单测。
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

/** 把尾节点连到下标为 pos 的节点（构造环），pos<0 表示无环。返回头节点。 */
export function buildCycleList(values: readonly number[], pos: number): ListNode | null {
  const head = buildList(values);
  if (pos < 0 || head === null) return head;
  // 找到第 pos 个节点（环入口）与尾节点
  let entry = head;
  for (let i = 0; i < pos; i++) entry = entry.next!;
  let tail: ListNode = head;
  while (tail.next !== null) tail = tail.next;
  tail.next = entry; // 成环
  return head;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface HasCycleHooks {
  /** 快慢指针各前进后的新节点（慢 1 步、快 2 步）。 */
  onStep?: (slow: ListNode | null, fast: ListNode | null) => void;
  /** 计算完成，给出是否有环。 */
  onDone?: (hasCycle: boolean) => void;
}

/**
 * 快慢指针判断链表是否有环。
 * 时间 O(n)，空间 O(1)。
 */
export function hasCycle(head: ListNode | null, hooks: HasCycleHooks = {}): boolean {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  let guard = 0;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    hooks.onStep?.(slow, fast);
    if (slow === fast) {
      hooks.onDone?.(true);
      return true;
    }
    if (++guard > 1_000_000) break;
  }
  hooks.onDone?.(false);
  return false;
}
