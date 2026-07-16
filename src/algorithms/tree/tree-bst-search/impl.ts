// =============================================================================
// BST 查找 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface SearchHooks {
  onCompare?: (
    current: number,
    key: number,
    direction: 'left' | 'right' | 'equal' | 'miss',
  ) => void;
}

export function search(root: BstNode | null, key: number, hooks: SearchHooks = {}): BstNode | null {
  let node = root;
  while (node !== null) {
    if (key === node.value) {
      hooks.onCompare?.(node.value, key, 'equal');
      return node;
    }
    if (key < node.value) {
      hooks.onCompare?.(node.value, key, 'left');
      node = node.left;
    } else {
      hooks.onCompare?.(node.value, key, 'right');
      node = node.right;
    }
  }
  hooks.onCompare?.(NaN, key, 'miss');
  return null;
}

export function contains(root: BstNode | null, key: number): boolean {
  return search(root, key) !== null;
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
