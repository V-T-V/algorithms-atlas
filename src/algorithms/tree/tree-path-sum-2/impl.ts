export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface PathSumHooks {
  onVisit?: (v: number, remain: number) => void;
  onResult?: (has: boolean) => void;
}
export function hasPathSum(
  root: TreeNode | null,
  target: number,
  hooks: PathSumHooks = {},
): boolean {
  const go = (n: TreeNode | null, rem: number): boolean => {
    if (!n) return false;
    hooks.onVisit?.(n.value, rem - n.value);
    if (!n.left && !n.right) return rem - n.value === 0;
    return go(n.left, rem - n.value) || go(n.right, rem - n.value);
  };
  const r = go(root, target);
  hooks.onResult?.(r);
  return r;
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
