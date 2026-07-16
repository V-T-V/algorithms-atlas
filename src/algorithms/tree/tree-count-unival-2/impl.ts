export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface UnivalHooks {
  onUnival?: (v: number) => void;
  onResult?: (n: number) => void;
}
export function countUnival(root: TreeNode | null, hooks: UnivalHooks = {}): number {
  let cnt = 0;
  const go = (n: TreeNode | null): boolean => {
    if (!n) return true;
    const l = go(n.left),
      r = go(n.right);
    if (
      l &&
      r &&
      (!n.left || n.left.value === n.value) &&
      (!n.right || n.right.value === n.value)
    ) {
      cnt++;
      hooks.onUnival?.(n.value);
      return true;
    }
    return false;
  };
  go(root);
  hooks.onResult?.(cnt);
  return cnt;
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
