// =============================================================================
// 二叉搜索树插入 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface InsertHooks {
  onCompare?: (current: number, key: number, direction: 'left' | 'right') => void;
  onAttach?: (parent: number | null, key: number, side: 'left' | 'right' | 'root') => void;
}

/** 插入 key 到以 root 为根的 BST，返回（可能新的）根。 */
export function insert(root: BstNode | null, key: number, hooks: InsertHooks = {}): BstNode {
  if (root === null) {
    hooks.onAttach?.(null, key, 'root');
    return new BstNode(key);
  }
  let node: BstNode = root;
  while (true) {
    if (key === node.value) {
      // 相等不插入
      return root;
    }
    if (key < node.value) {
      hooks.onCompare?.(node.value, key, 'left');
      if (node.left === null) {
        node.left = new BstNode(key);
        hooks.onAttach?.(node.value, key, 'left');
        return root;
      }
      node = node.left;
    } else {
      hooks.onCompare?.(node.value, key, 'right');
      if (node.right === null) {
        node.right = new BstNode(key);
        hooks.onAttach?.(node.value, key, 'right');
        return root;
      }
      node = node.right;
    }
  }
}

/** 从数组构建 BST。 */
export function buildBST(keys: number[], hooks: InsertHooks = {}): BstNode | null {
  let root: BstNode | null = null;
  for (const k of keys) root = insert(root, k, hooks);
  return root;
}

/** 中序遍历（验证 BST 性质）。 */
export function inorder(root: BstNode | null): number[] {
  const out: number[] = [];
  const stack: BstNode[] = [];
  let node = root;
  while (stack.length > 0 || node !== null) {
    while (node !== null) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop()!;
    out.push(node.value);
    node = node.right;
  }
  return out;
}
