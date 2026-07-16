export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface ValidateHooks {
  onVisit?: (v: number, ok: boolean) => void;
  onResult?: (ok: boolean) => void;
}
export function isValidBST(root: TreeNode | null, hooks: ValidateHooks = {}): boolean {
  const go = (n: TreeNode | null, lo: number, hi: number): boolean => {
    if (!n) return true;
    const ok = n.value > lo && n.value < hi;
    hooks.onVisit?.(n.value, ok);
    if (!ok) return false;
    return go(n.left, lo, n.value) && go(n.right, n.value, hi);
  };
  const r = go(root, -Infinity, Infinity);
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
