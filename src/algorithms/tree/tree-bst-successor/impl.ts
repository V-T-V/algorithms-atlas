// =============================================================================
// BST 后继 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface SuccHooks {
  onStep?: (current: number, key: number, candidate: number | null, goLeft: boolean) => void;
}

/** 找大于 key 的最小值；不存在返回 null。 */
export function successor(
  root: BstNode | null,
  key: number,
  hooks: SuccHooks = {},
): BstNode | null {
  let succ: BstNode | null = null;
  let node = root;
  while (node !== null) {
    if (key < node.value) {
      succ = node;
      hooks.onStep?.(node.value, key, succ?.value ?? null, true);
      node = node.left;
    } else {
      hooks.onStep?.(node.value, key, succ?.value ?? null, false);
      node = node.right;
    }
  }
  return succ;
}

/** 若 key 存在，返回它的中序后继（右子树最小或祖先）；不存在或无后继返回 null。 */
export function inorderSuccessor(root: BstNode | null, key: number): BstNode | null {
  let node = root;
  while (node !== null && node.value !== key) {
    node = key < node.value ? node.left : node.right;
  }
  if (node === null) return null;
  if (node.right !== null) {
    let n = node.right;
    while (n!.left !== null) n = n!.left;
    return n;
  }
  return successor(root, key);
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
