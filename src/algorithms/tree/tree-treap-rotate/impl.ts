// =============================================================================
// 树堆（Treap）旋转 · 纯算法实现
// =============================================================================

export class TreapNode {
  constructor(
    public key: number,
    public priority: number,
    public left: TreapNode | null = null,
    public right: TreapNode | null = null,
  ) {}
}

export interface TreapHooks {
  onRotate?: (dir: 'L' | 'R', at: number) => void;
}

/** 右旋：把 t 的左儿子提上来。返回新根。 */
export function rotateRight(t: TreapNode): TreapNode {
  const l = t.left!;
  t.left = l.right;
  l.right = t;
  return l;
}

/** 左旋：把 t 的右儿子提上来。返回新根。 */
export function rotateLeft(t: TreapNode): TreapNode {
  const r = t.right!;
  t.right = r.left;
  r.left = t;
  return r;
}

/** 简单线性同余 PRNG（确定性，便于测试）。 */
export function makePRNG(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

/** 递归插入：BST 插入 + 沿返回路径堆序修复。 */
export function insert(
  root: TreapNode | null,
  key: number,
  priority: number,
  hooks: TreapHooks = {},
): TreapNode {
  if (root === null) return new TreapNode(key, priority);
  if (key < root.key) {
    root.left = insert(root.left, key, priority, hooks);
    if (root.left!.priority < root.priority) {
      hooks.onRotate?.('R', root.key);
      return rotateRight(root);
    }
    return root;
  }
  if (key > root.key) {
    root.right = insert(root.right, key, priority, hooks);
    if (root.right!.priority < root.priority) {
      hooks.onRotate?.('L', root.key);
      return rotateLeft(root);
    }
    return root;
  }
  return root; // 重复
}

export function buildTreap(
  entries: { key: number; priority: number }[],
  hooks: TreapHooks = {},
): TreapNode | null {
  let root: TreapNode | null = null;
  for (const { key, priority } of entries) root = insert(root, key, priority, hooks);
  return root;
}

export function inorder(root: TreapNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.key, ...inorder(root.right)];
}

export function height(node: TreapNode | null): number {
  if (node === null) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

/** 校验堆性质（小顶：父优先级 ≤ 子）。 */
export function isHeapOrdered(root: TreapNode | null): boolean {
  if (root === null) return true;
  if (root.left !== null && root.left.priority < root.priority) return false;
  if (root.right !== null && root.right.priority < root.priority) return false;
  return isHeapOrdered(root.left) && isHeapOrdered(root.right);
}

/** 校验 BST 性质。 */
export function isBST(root: TreapNode | null): boolean {
  const arr = inorder(root);
  for (let i = 1; i < arr.length; i++) if (arr[i]! <= arr[i - 1]!) return false;
  return true;
}
