// =============================================================================
// BST 恢复（变体）· 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface RecoverHooks {
  onInversion?: (prev: number, current: number, firstSet: boolean) => void;
  onSwap?: (a: number, b: number) => void;
}

/** 原地恢复（修改树节点值）。返回 [firstValue, secondValue]。 */
export function recoverTree(
  root: BstNode | null,
  hooks: RecoverHooks = {},
): [number, number] | null {
  let prev: BstNode | null = null;
  let first: BstNode | null = null;
  let second: BstNode | null = null;

  const visit = (node: BstNode) => {
    if (prev !== null && prev.value > node.value) {
      hooks.onInversion?.(prev.value, node.value, first === null);
      if (first === null) first = prev;
      second = node;
    }
    prev = node;
  };

  // Morris 中序遍历（O(1) 额外空间）
  let node = root;
  while (node !== null) {
    if (node.left === null) {
      visit(node);
      node = node.right;
    } else {
      // 找前驱
      let pred = node.left;
      while (pred!.right !== null && pred!.right !== node) pred = pred!.right;
      if (pred!.right === null) {
        pred!.right = node;
        node = node.left;
      } else {
        pred!.right = null;
        visit(node);
        node = node.right;
      }
    }
  }

  if (first !== null && second !== null) {
    const f: BstNode = first;
    const s: BstNode = second;
    hooks.onSwap?.(f.value, s.value);
    const tmp = f.value;
    f.value = s.value;
    s.value = tmp;
    return [tmp, f.value];
  }
  return null;
}

export function inorder(root: BstNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}

export function makeNode(
  value: number,
  left: BstNode | null = null,
  right: BstNode | null = null,
): BstNode {
  return new BstNode(value, left, right);
}
