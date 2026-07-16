// =============================================================================
// 有序数组构造平衡 BST · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface BuildHooks {
  onPick?: (index: number, value: number, lo: number, hi: number) => void;
}

export function sortedArrayToBST(arr: number[], hooks: BuildHooks = {}): BstNode | null {
  if (arr.length === 0) return null;
  // 验证有序
  for (let i = 1; i < arr.length; i++) {
    if (arr[i]! < arr[i - 1]!) throw new RangeError('数组必须升序');
  }
  return build(arr, 0, arr.length - 1, hooks);
}

function build(arr: number[], lo: number, hi: number, hooks: BuildHooks): BstNode | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  hooks.onPick?.(mid, arr[mid]!, lo, hi);
  const node = new BstNode(arr[mid]!);
  node.left = build(arr, lo, mid - 1, hooks);
  node.right = build(arr, mid + 1, hi, hooks);
  return node;
}

export function height(root: BstNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}

export function inorder(root: BstNode | null): number[] {
  if (root === null) return [];
  return [...inorder(root.left), root.value, ...inorder(root.right)];
}
