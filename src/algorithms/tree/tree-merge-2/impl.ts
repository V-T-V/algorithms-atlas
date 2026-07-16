export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface MergeHooks {
  onMerge?: (a: number | null, b: number | null, sum: number) => void;
  onResult?: (root: TreeNode | null) => void;
}
export function mergeTrees(
  a: TreeNode | null,
  b: TreeNode | null,
  hooks: MergeHooks = {},
): TreeNode | null {
  if (!a) return b;
  if (!b) return a;
  const sum = a.value + b.value;
  hooks.onMerge?.(a.value, b.value, sum);
  const node = new TreeNode(sum);
  node.left = mergeTrees(a.left, b.left, hooks);
  node.right = mergeTrees(a.right, b.right, hooks);
  hooks.onResult?.(node);
  return node;
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
