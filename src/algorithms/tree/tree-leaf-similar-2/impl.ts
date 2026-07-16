export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface LeafSimHooks {
  onLeaf?: (v: number) => void;
  onResult?: (same: boolean) => void;
}
function leaves(root: TreeNode | null, hooks: LeafSimHooks): number[] {
  const out: number[] = [];
  const go = (n: TreeNode | null) => {
    if (!n) return;
    if (!n.left && !n.right) {
      out.push(n.value);
      hooks.onLeaf?.(n.value);
    }
    go(n.left);
    go(n.right);
  };
  go(root);
  return out;
}
export function leafSimilar(
  a: TreeNode | null,
  b: TreeNode | null,
  hooks: LeafSimHooks = {},
): boolean {
  const la = leaves(a, hooks),
    lb = leaves(b, hooks);
  const r = la.length === lb.length && la.every((v, i) => v === lb[i]);
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
