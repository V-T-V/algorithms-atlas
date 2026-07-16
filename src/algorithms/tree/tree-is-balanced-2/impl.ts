export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface BalanceHooks {
  onVisit?: (v: number, balanced: boolean) => void;
  onResult?: (b: boolean) => void;
}
export function isBalanced(root: TreeNode | null, hooks: BalanceHooks = {}): boolean {
  const go = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = go(n.left),
      r = go(n.right);
    const bal = l !== -1 && r !== -1 && Math.abs(l - r) <= 1;
    hooks.onVisit?.(n.value, bal);
    return bal ? 1 + Math.max(l, r) : -1;
  };
  const b = go(root) !== -1;
  hooks.onResult?.(b);
  return b;
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
