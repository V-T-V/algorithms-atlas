// =============================================================================
// BST 迭代器（BST Iterator，中序 / 惰性）· 纯算法实现（零 DOM 依赖，可独立单测）
// LeetCode 173 风格：用栈模拟中序，next()/hasNext() 均 O(1) 均摊。
// =============================================================================

/** BST 节点（纯数据，无父指针）。 */
export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface IteratorHooks {
  /** 每次 next() 返回一个值时。 */
  onNext?: (value: number) => void;
}

/**
 * BST 中序迭代器（惰性，栈式）。
 *
 * 维护一个栈，初始化时把「从根沿左链一路到底」的节点压栈。每次：
 *
 * - `hasNext()`：栈非空即还有下一个
 * - `next()`：弹出栈顶（当前最小），返回其值；然后对其右子节点沿左链压栈
 *
 * 直观理解：把中序遍历「**惰性化**」——不预先算出全部序列，而是按需产出下一个最小值。
 * 关键不变量：**栈顶始终是「剩余节点中的最小值」**。
 *
 * **复杂度**：
 * - `hasNext()` `O(1)`
 * - `next()` **均摊 `O(1)`**：每个节点恰好被压栈、出栈各一次，n 次 next 总代价 `O(n)`
 * - 空间 `O(h)`（h 为树高，而非 `O(n)`）——比「预存中序数组」省内存
 *
 * 这就是 LeetCode 173「Binary Search Tree Iterator」的标准解，也用于 `for...of` 遍历树、
 * 流式处理超大 BST 而无法一次性载入的场景。
 *
 * 本实现额外提供 `toArray()`（用迭代器跑完）便于测试与一次性取结果。
 */
export class BSTIterator {
  private stack: BSTNode[] = [];

  constructor(root: BSTNode | null) {
    this.pushLeft(root);
  }

  /** 沿左链把节点一路压栈到底。 */
  private pushLeft(node: BSTNode | null): void {
    let cur = node;
    while (cur) {
      this.stack.push(cur);
      cur = cur.left;
    }
  }

  /** 是否还有下一个值。 */
  hasNext(): boolean {
    return this.stack.length > 0;
  }

  /** 返回下一个（中序的下一个，即当前最小）值。 */
  next(): number {
    const top = this.stack.pop()!;
    // 其右子树的左链入栈，保证栈顶仍是剩余最小
    this.pushLeft(top.right);
    return top.value;
  }
}

/**
 * 用迭代器跑完整个中序遍历，返回数组。可选地通过 hooks 报告每次 next。
 *
 * @param root BST 根
 * @param hooks 可选的事件钩子
 * @returns 中序（升序）数组
 */
export function bstIterator(root: BSTNode | null, hooks: IteratorHooks = {}): number[] {
  const out: number[] = [];
  const it = new BSTIterator(root);
  while (it.hasNext()) {
    const v = it.next();
    out.push(v);
    hooks.onNext?.(v);
  }
  return out;
}

/** 顺序插入构建 BST。 */
export function bstInsert(values: readonly number[]): BSTNode | null {
  let root: BSTNode | null = null;
  const insert = (node: BSTNode | null, v: number): BSTNode => {
    if (!node) return { value: v, left: null, right: null };
    if (v < node.value) node.left = insert(node.left, v);
    else if (v > node.value) node.right = insert(node.right, v);
    return node;
  };
  for (const v of values) root = insert(root, v);
  return root;
}
