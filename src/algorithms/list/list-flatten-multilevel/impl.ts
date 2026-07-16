// =============================================================================
// 多级双向链表扁平化（LeetCode 430）· 纯算法实现
// =============================================================================

export interface MultiNode {
  value: number;
  prev: MultiNode | null;
  next: MultiNode | null;
  child: MultiNode | null;
}

export interface FlattenHooks {
  onSplice?: (parentValue: number, childHeadValue: number) => void;
  onDone?: (head: MultiNode | null) => void;
}

/**
 * 扁平化多级双向链表（DFS，遇 child 即插入）。
 */
export function flattenMultilevel(
  head: MultiNode | null,
  hooks: FlattenHooks = {},
): MultiNode | null {
  flattenDfs(head, hooks);
  hooks.onDone?.(head);
  return head;
}

/** 返回扁平化后该段的尾节点。 */
function flattenDfs(node: MultiNode | null, hooks: FlattenHooks): MultiNode | null {
  let cur = node;
  let prev: MultiNode | null = null;
  while (cur !== null) {
    if (cur.child !== null) {
      const childHead = cur.child;
      const childTail = flattenDfs(childHead, hooks);
      hooks.onSplice?.(cur.value, childHead.value);
      const next = cur.next;
      // 插入子链表
      cur.next = childHead;
      childHead.prev = cur;
      cur.child = null;
      childTail!.next = next;
      if (next !== null) next.prev = childTail;
      prev = childTail;
      cur = next;
    } else {
      prev = cur;
      cur = cur.next;
    }
  }
  return prev;
}

/** 构造多级双向链表：节点值序列，child 映射（parentIndex -> childIndex），返回节点表与头。 */
export function buildMultilevel(
  values: readonly number[],
  childMap: Record<number, number>,
): MultiNode | null {
  if (values.length === 0) return null;
  const nodes: MultiNode[] = values.map((v) => ({ value: v, prev: null, next: null, child: null }));
  for (let i = 0; i < nodes.length; i++) {
    if (i + 1 < nodes.length) {
      nodes[i]!.next = nodes[i + 1]!;
      nodes[i + 1]!.prev = nodes[i]!;
    }
  }
  for (const [k, v] of Object.entries(childMap)) {
    nodes[Number(k)]!.child = nodes[v]!;
  }
  return nodes[0]!;
}

/** 拍平为值数组（仅沿 next）。 */
export function multiListToArray(head: MultiNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}
