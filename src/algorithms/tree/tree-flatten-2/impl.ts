export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface FlattenHooks {
  onSplice?: (parent: number, child: number | null) => void;
  onResult?: () => void;
}
export function flatten(root: TreeNode | null, hooks: FlattenHooks = {}): void {
  const go = (n: TreeNode | null): TreeNode | null => {
    if (!n) return null;
    const leftTail = go(n.left);
    const rightTail = go(n.right);
    if (n.left) {
      leftTail!.right = n.right;
      n.right = n.left;
      hooks.onSplice?.(n.value, n.left.value);
      n.left = null;
    }
    return rightTail ?? leftTail ?? n;
  };
  go(root);
  hooks.onResult?.();
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
