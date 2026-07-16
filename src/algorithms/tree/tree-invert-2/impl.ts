export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface InvertHooks {
  onSwap?: (v: number) => void;
  onResult?: (root: TreeNode | null) => void;
}
export function invertTree(root: TreeNode | null, hooks: InvertHooks = {}): TreeNode | null {
  if (!root) return null;
  hooks.onSwap?.(root.value);
  const l = invertTree(root.left, hooks);
  const r = invertTree(root.right, hooks);
  root.left = r;
  root.right = l;
  hooks.onResult?.(root);
  return root;
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
