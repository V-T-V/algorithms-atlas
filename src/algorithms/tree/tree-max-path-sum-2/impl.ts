export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface MaxSumHooks {
  onNode?: (v: number, sum: number) => void;
  onResult?: (m: number) => void;
}
export function maxPathSum(root: TreeNode | null, hooks: MaxSumHooks = {}): number {
  let best = -Infinity;
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = Math.max(0, go(n.left));
    const r = Math.max(0, go(n.right));
    best = Math.max(best, n.value + l + r);
    hooks.onNode?.(n.value, n.value + l + r);
    return n.value + Math.max(l, r);
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
