export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface BfHooks {
  onNode?: (v: number, bf: number) => void;
  onResult?: (factors: Array<{ v: number; bf: number }>) => void;
}
export function balanceFactors(
  root: TreeNode | null,
  hooks: BfHooks = {},
): Array<{ v: number; bf: number }> {
  const out: Array<{ v: number; bf: number }> = [];
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left),
      r = go(n.right);
    const bf = l - r;
    out.push({ v: n.value, bf });
    hooks.onNode?.(n.value, bf);
    return 1 + Math.max(l, r);
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
