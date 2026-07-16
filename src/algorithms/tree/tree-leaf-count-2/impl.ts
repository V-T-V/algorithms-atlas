export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface LeafHooks {
  onLeaf?: (v: number) => void;
  onResult?: (n: number) => void;
}
export function countLeaves(root: TreeNode | null, hooks: LeafHooks = {}): number {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    if (!n.left && !n.right) {
      hooks.onLeaf?.(n.value);
      return 1;
    }
    return go(n.left) + go(n.right);
  };
  const n = go(root);
  hooks.onResult?.(n);
  return n;
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
