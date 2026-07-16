export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface MinDepthHooks {
  onVisit?: (v: number) => void;
  onResult?: (d: number) => void;
}
export function minDepth(root: TreeNode | null, hooks: MinDepthHooks = {}): number {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    hooks.onVisit?.(n.value);
    if (!n.left) return 1 + go(n.right);
    if (!n.right) return 1 + go(n.left);
    return 1 + Math.min(go(n.left), go(n.right));
  };
  const d = go(root);
  hooks.onResult?.(d);
  return d;
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
