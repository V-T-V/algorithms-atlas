// =============================================================================
// 循环有序链表插入 · 纯算法实现
// =============================================================================

export interface ListNode {
  value: number;
  next: ListNode | null;
}

export function buildCircular(values: readonly number[]): ListNode | null {
  if (values.length === 0) return null;
  const dummy: ListNode = { value: NaN, next: null };
  let tail = dummy;
  const nodes: ListNode[] = [];
  for (const v of values) {
    const n: ListNode = { value: v, next: null };
    tail.next = n;
    tail = n;
    nodes.push(n);
  }
  tail.next = nodes[0]!; // 成环
  return nodes[0]!;
}

export function circularToArray(head: ListNode | null, max = 100): number[] {
  if (head === null) return [];
  const out: number[] = [];
  let cur: ListNode | null = head;
  do {
    out.push(cur!.value);
    cur = cur!.next;
    if (out.length > max) break;
  } while (cur !== head && cur !== null);
  return out;
}

export interface InsertCircularHooks {
  onSearch?: (prev: number, next: number) => void;
  onInsert?: (insertValue: number, prev: number, next: number) => void;
  onDone?: (head: ListNode | null) => void;
}

/**
 * 向升序循环链表插入一个新节点 insertVal，返回头（可能变也可能不变）。
 */
export function insertCircularSorted(
  head: ListNode | null,
  insertVal: number,
  hooks: InsertCircularHooks = {},
): ListNode | null {
  const node: ListNode = { value: insertVal, next: null };
  if (head === null) {
    node.next = node;
    hooks.onDone?.(node);
    return node;
  }
  let prev = head;
  let next = head.next!;
  let inserted = false;
  // 遍历一圈
  do {
    hooks.onSearch?.(prev.value, next.value);
    // 情况 1：prev ≤ insertVal ≤ next（正常区间内）
    if (prev.value <= insertVal && insertVal <= next.value) {
      prev.next = node;
      node.next = next;
      hooks.onInsert?.(insertVal, prev.value, next.value);
      inserted = true;
      break;
    }
    // 情况 2：prev > next（跨过最大/最小边界）且 insertVal ≥ prev 或 insertVal ≤ next
    if (prev.value > next.value && (insertVal >= prev.value || insertVal <= next.value)) {
      prev.next = node;
      node.next = next;
      hooks.onInsert?.(insertVal, prev.value, next.value);
      inserted = true;
      break;
    }
    prev = next;
    next = next.next!;
  } while (prev !== head);
  // 情况 3：所有值相同，插到 head 后
  if (!inserted) {
    const tmp = head.next!;
    head.next = node;
    node.next = tmp;
    hooks.onInsert?.(insertVal, head.value, tmp.value);
  }
  hooks.onDone?.(head);
  return head;
}
