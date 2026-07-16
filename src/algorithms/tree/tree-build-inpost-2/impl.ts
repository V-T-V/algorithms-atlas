export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface BuildHooks {
  onCreate?: (v: number) => void;
  onResult?: (root: TreeNode | null) => void;
}
export function buildFromInPost(
  inorder: number[],
  postorder: number[],
  hooks: BuildHooks = {},
): TreeNode | null {
  const idx = new Map<number, number>();
  inorder.forEach((v, i) => idx.set(v, i));
  let pi = postorder.length - 1;
  const go = (lo: number, hi: number): TreeNode | null => {
    if (lo > hi) return null;
    const v = postorder[pi--]!;
    hooks.onCreate?.(v);
    const node = new TreeNode(v);
    const m = idx.get(v)!;
    node.right = go(m + 1, hi);
    node.left = go(lo, m - 1);
    return node;
  };
  const r = go(0, inorder.length - 1);
  hooks.onResult?.(r);
  return r;
}
