export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface LeftViewHooks {
  onLevel?: (depth: number, v: number) => void;
  onResult?: (out: number[]) => void;
}
export function leftSideView(root: TreeNode | null, hooks: LeftViewHooks = {}): number[] {
  const out: number[] = [];
  if (!root) {
    hooks.onResult?.(out);
    return out;
  }
  const q: TreeNode[] = [root];
  while (q.length) {
    const sz = q.length;
    for (let i = 0; i < sz; i++) {
      const node = q.shift()!;
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
      if (i === 0) {
        out.push(node.value);
        hooks.onLevel?.(out.length - 1, node.value);
      }
    }
  }
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
