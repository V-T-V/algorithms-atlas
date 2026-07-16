// =============================================================================
// BST 最近公共祖先 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface LcaHooks {
  onVisit?: (current: number, p: number, q: number, action: 'left' | 'right' | 'found') => void;
}

/** 返回 p、q 在 BST 中的最近公共祖先节点。假设 p <= q 且都在树中。 */
export function lowestCommonAncestor(
  root: BstNode | null,
  p: number,
  q: number,
  hooks: LcaHooks = {},
): BstNode | null {
  if (root === null) return null;
  let node: BstNode | null = root;
  const lo = Math.min(p, q);
  const hi = Math.max(p, q);
  while (node !== null) {
    if (hi < node.value) {
      hooks.onVisit?.(node.value, p, q, 'left');
      node = node.left;
    } else if (lo > node.value) {
      hooks.onVisit?.(node.value, p, q, 'right');
      node = node.right;
    } else {
      hooks.onVisit?.(node.value, p, q, 'found');
      return node;
    }
  }
  return null;
}

export function buildBST(keys: number[]): BstNode | null {
  let root: BstNode | null = null;
  for (const k of keys) root = insert(root, k);
  return root;
}

function insert(root: BstNode | null, key: number): BstNode {
  if (root === null) return new BstNode(key);
  if (key < root.value) root.left = insert(root.left, key);
  else if (key > root.value) root.right = insert(root.right, key);
  return root;
}
