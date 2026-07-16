export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface SameHooks {
  onCompare?: (a: number | null, b: number | null) => void;
  onResult?: (s: boolean) => void;
}
export function isSameTree(a: TreeNode | null, b: TreeNode | null, hooks: SameHooks = {}): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  hooks.onCompare?.(a.value, b.value);
  return (
    a.value === b.value && isSameTree(a.left, b.left, hooks) && isSameTree(a.right, b.right, hooks)
  );
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
