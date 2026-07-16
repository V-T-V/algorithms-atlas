export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface DiameterHooks {
  onVisit?: (v: number, path: number) => void;
  onResult?: (d: number) => void;
}
export function diameter(root: TreeNode | null, hooks: DiameterHooks = {}): number {
  let best = 0;
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left),
      r = go(n.right);
    best = Math.max(best, l + r);
    hooks.onVisit?.(n.value, l + r);
    return 1 + Math.max(l, r);
  };
  go(root);
  hooks.onResult?.(best);
  return best;
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
