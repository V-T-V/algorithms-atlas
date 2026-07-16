export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface SubHooks {
  onTry?: (v: number) => void;
  onResult?: (b: boolean) => void;
}
function same(a: TreeNode | null, b: TreeNode | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.value === b.value && same(a.left, b.left) && same(a.right, b.right);
}
export function isSubtree(
  root: TreeNode | null,
  sub: TreeNode | null,
  hooks: SubHooks = {},
): boolean {
  if (!sub) {
    hooks.onResult?.(true);
    return true;
  }
  if (!root) {
    hooks.onResult?.(false);
    return false;
  }
  if (same(root, sub)) {
    hooks.onTry?.(root.value);
    hooks.onResult?.(true);
    return true;
  }
  return isSubtree(root.left, sub, hooks) || isSubtree(root.right, sub, hooks);
}
export function buildTree(arr: Array<number | null>): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const q: TreeNode[] = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      q.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}
