// =============================================================================
// AVL 旋转 · 纯算法实现
// =============================================================================

export class AvlNode {
  constructor(
    public value: number,
    public left: AvlNode | null = null,
    public right: AvlNode | null = null,
    public height: number = 1,
  ) {}
}

export interface RotationHooks {
  onRotate?: (kind: 'LL' | 'RR' | 'LR' | 'RL', at: number) => void;
}

export function h(node: AvlNode | null): number {
  return node === null ? 0 : node.height;
}

export function updateHeight(node: AvlNode): void {
  node.height = 1 + Math.max(h(node.left), h(node.right));
}

export function balanceFactor(node: AvlNode): number {
  return h(node.left) - h(node.right);
}

/** 右旋（LL）。 */
export function rotateRight(y: AvlNode): AvlNode {
  const x = y.left!;
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

/** 左旋（RR）。 */
export function rotateLeft(x: AvlNode): AvlNode {
  const y = x.right!;
  const t2 = y.left;
  y.left = x;
  x.right = t2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

/** 对 node 做平衡（假设左右子已平衡）。返回新根。 */
export function rebalance(node: AvlNode, hooks: RotationHooks = {}): AvlNode {
  updateHeight(node);
  const bf = balanceFactor(node);
  if (bf > 1) {
    // 左重
    if (balanceFactor(node.left!) < 0) {
      hooks.onRotate?.('LR', node.value);
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }
    hooks.onRotate?.('LL', node.value);
    return rotateRight(node);
  }
  if (bf < -1) {
    // 右重
    if (balanceFactor(node.right!) > 0) {
      hooks.onRotate?.('RL', node.value);
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }
    hooks.onRotate?.('RR', node.value);
    return rotateLeft(node);
  }
  return node;
}

export function insert(root: AvlNode | null, key: number, hooks: RotationHooks = {}): AvlNode {
  if (root === null) return new AvlNode(key);
  if (key < root.value) root.left = insert(root.left, key, hooks);
  else if (key > root.value) root.right = insert(root.right, key, hooks);
  else return root; // 不重复
  return rebalance(root, hooks);
}

export function buildAVL(keys: number[], hooks: RotationHooks = {}): AvlNode | null {
  let root: AvlNode | null = null;
  for (const k of keys) root = insert(root, k, hooks);
  return root;
}

export function inorder(root: AvlNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

export function height(root: AvlNode | null): number {
  return root === null ? 0 : root.height;
}
