// =============================================================================
// BST 从前序遍历构造 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface BuildHooks {
  onCreate?: (value: number, bound: string) => void;
}

export function bstFromPreorder(preorder: number[], hooks: BuildHooks = {}): BstNode | null {
  if (preorder.length === 0) return null;
  // 用可变索引（包在对象里）
  const state = { i: 0 };
  return build(preorder, state, -Infinity, Infinity, hooks);
}

function build(
  preorder: number[],
  state: { i: number },
  min: number,
  max: number,
  hooks: BuildHooks,
): BstNode | null {
  if (state.i >= preorder.length) return null;
  const val = preorder[state.i]!;
  if (val < min || val > max) return null;
  state.i++;
  hooks.onCreate?.(val, `(${min}, ${max})`);
  const node = new BstNode(val);
  node.left = build(preorder, state, min, val, hooks);
  node.right = build(preorder, state, val, max, hooks);
  return node;
}

export function preorder(root: BstNode | null): number[] {
  if (root === null) return [];
  return [root.value, ...preorder(root.left), ...preorder(root.right)];
}

export function inorder(root: BstNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}
