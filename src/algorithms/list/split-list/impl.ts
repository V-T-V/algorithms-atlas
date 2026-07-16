// =============================================================================
// 分割链表（Split Linked List in Parts）· 纯算法实现
// 把链表尽量均分成 k 段，前若干段多一个节点。零 DOM 依赖，可独立单测。
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
export interface SplitListHooks {
  /** 切出一段，长度 len。 */
  onPart?: (partIndex: number, len: number, head: ListNode | null) => void;
  /** 计算完成。 */
  onDone?: (parts: Array<ListNode | null>) => void;
}

/**
 * 把链表分成 k 段：前 (n%k) 段各 (n/k+1) 个节点，其余各 (n/k) 个。
 * 时间 O(n)，空间 O(k)（结果数组）。
 */
export function splitList(
  head: ListNode | null,
  k: number,
  hooks: SplitListHooks = {},
): Array<ListNode | null> {
  // 求长度
  let n = 0;
  let cur = head;
  while (cur) {
    n++;
    cur = cur.next;
  }
  const base = Math.floor(n / k);
  let extra = n % k;
  const parts: Array<ListNode | null> = [];
  let node: ListNode | null = head;
  for (let i = 0; i < k; i++) {
    const size = base + (extra > 0 ? 1 : 0);
    extra = Math.max(0, extra - 1);
    const partHead = node;
    // 走 size-1 步
    let prev: ListNode | null = null;
    for (let j = 0; j < size && node !== null; j++) {
      prev = node;
      node = node.next;
    }
    if (prev !== null) prev.next = null; // 断开
    parts.push(partHead);
    hooks.onPart?.(i, size, partHead);
  }
  hooks.onDone?.(parts);
  return parts;
}

/** 把多段拍平成数值二维数组（便于断言）。 */
export function partsToArray(parts: Array<ListNode | null>): number[][] {
  return parts.map(listToArray);
}
