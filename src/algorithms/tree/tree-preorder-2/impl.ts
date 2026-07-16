export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface PreorderHooks {
  onVisit?: (v: number) => void;
  onResult?: (out: number[]) => void;
}
export function preorder(root: TreeNode | null, hooks: PreorderHooks = {}): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) return;
    hooks.onVisit?.(n.value);
    out.push(n.value);
    go(n.left);
    go(n.right);
  };
  go(root);
  hooks.onResult?.(out);
  return out;
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
