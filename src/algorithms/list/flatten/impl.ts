// =============================================================================
// 展平多级链表（Flatten a Multilevel Doubly Linked List）· 纯算法实现
// 每个节点可能有 child 指向另一条子链，按深度优先展平成单层双向链表。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 双向多级链表节点。 */
export interface MultiNode {
  value: number;
  next: MultiNode | null;
  prev: MultiNode | null;
  child: MultiNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FlattenHooks {
  /** 遇到一个 child 子链，准备插入。 */
  onChild?: (parent: MultiNode, child: MultiNode) => void;
  /** 计算完成。 */
  onDone?: (head: MultiNode | null) => void;
}

/**
 * 原地展平多级双向链表（深度优先：遇到 child 立即插入到当前节点之后）。
 * 时间 O(n)，空间 O(1)（迭代版用尾接法，递归栈 O(深度)）。
 */
export function flatten(head: MultiNode | null, hooks: FlattenHooks = {}): MultiNode | null {
  if (head === null) return null;
  let cur: MultiNode | null = head;
  // 用栈暂存遇 child 时的后续断点
  const stack: MultiNode[] = [];
  while (cur !== null) {
    if (cur.child !== null) {
      const child: MultiNode = cur.child;
      hooks.onChild?.(cur, child);
      // 若 cur 有 next，压栈稍后接回
      if (cur.next !== null) {
        stack.push(cur.next);
        cur.next.prev = null;
      }
      // 把 child 链插入 cur 之后
      cur.next = child;
      child.prev = cur;
      cur.child = null;
    }
    // 走到当前层的尾
    if (cur.next === null && stack.length > 0) {
      const nxt = stack.pop()!;
      cur.next = nxt;
      nxt.prev = cur;
    }
    cur = cur.next;
  }
  hooks.onDone?.(head);
  return head;
}

/** 从 (value, childIndex) 数组构建多级链表：childIndex[i] = i 的 child 指向的节点下标（-1 表示无）。
 *  返回头节点及所有节点引用数组。 */
export function buildMultiList(
  values: readonly number[],
  childIndex: readonly number[],
): { head: MultiNode | null; nodes: MultiNode[] } {
  if (values.length === 0) return { head: null, nodes: [] };
  const nodes: MultiNode[] = values.map((v) => ({ value: v, next: null, prev: null, child: null }));
  // 只连接「父链」上的 next：i 的 next 设为 i+1，除非 i 是某节点的 child（child 节点有自己的独立链）
  const childTargets = new Set<number>(childIndex.filter((c) => c >= 0 && c < nodes.length));
  for (let i = 0; i < nodes.length - 1; i++) {
    // 如果 i+1 是某节点的 child，则 i 的 next 不指向它（child 节点脱离父链）
    if (!childTargets.has(i + 1)) {
      nodes[i]!.next = nodes[i + 1]!;
      nodes[i + 1]!.prev = nodes[i]!;
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    const ci = childIndex[i] ?? -1;
    if (ci >= 0 && ci < nodes.length) nodes[i]!.child = nodes[ci]!;
  }
  return { head: nodes[0]!, nodes };
}

/** 把展平后的双向链表拍平成数值数组。 */
export function multiListToArray(head: MultiNode | null): number[] {
  const out: number[] = [];
  let cur = head;
  while (cur) {
    out.push(cur.value);
    cur = cur.next;
  }
  return out;
}
