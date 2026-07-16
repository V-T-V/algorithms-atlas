export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface LcaHooks {
  onVisit?: (v: number) => void;
  onResult?: (v: number | null) => void;
}
export function lowestCommonAncestor(
  root: TreeNode | null,
  p: number,
  q: number,
  hooks: LcaHooks = {},
): TreeNode | null {
  const go = (n: TreeNode | null): TreeNode | null => {
    if (!n) return null;
    if (n.value === p || n.value === q) {
      hooks.onVisit?.(n.value);
      return n;
    }
    const l = go(n.left),
      r = go(n.right);
    hooks.onVisit?.(n.value);
    if (l && r) return n;
    return l ?? r;
  };
  const res = go(root);
  hooks.onResult?.(res?.value ?? null);
  return res;
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
