// =============================================================================
// BST 前驱 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface PredHooks {
  onStep?: (current: number, key: number, candidate: number | null, goRight: boolean) => void;
}

/** 找小于 key 的最大值；不存在返回 null。 */
export function predecessor(
  root: BstNode | null,
  key: number,
  hooks: PredHooks = {},
): BstNode | null {
  let pred: BstNode | null = null;
  let node = root;
  while (node !== null) {
    if (key > node.value) {
      pred = node;
      hooks.onStep?.(node.value, key, pred?.value ?? null, true);
      node = node.right;
    } else {
      hooks.onStep?.(node.value, key, pred?.value ?? null, false);
      node = node.left;
    }
  }
  return pred;
}

/** 若 key 存在于树中，返回它的中序前驱节点（即左子树最大）；不存在或无前驱返回 null。 */
export function inorderPredecessor(root: BstNode | null, key: number): BstNode | null {
  // 找到 key 节点
  let node = root;
  while (node !== null && node.value !== key) {
    node = key < node.value ? node.left : node.right;
  }
  if (node === null) return null;
  // 左子树的最大
  if (node.left !== null) {
    let n = node.left;
    while (n!.right !== null) n = n!.right;
    return n;
  }
  // 否则沿父链找（这里无父指针，用整体方法）
  return predecessor(root, key);
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
