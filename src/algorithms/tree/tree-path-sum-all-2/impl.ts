export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface PathAllHooks {
  onPath?: (path: number[]) => void;
  onResult?: (paths: number[][]) => void;
}
export function pathSumAll(
  root: TreeNode | null,
  target: number,
  hooks: PathAllHooks = {},
): number[][] {
  const out: number[][] = [],
    cur: number[] = [];
  const go = (n: TreeNode | null, sum: number) => {
    if (!n) return;
    cur.push(n.value);
    if (!n.left && !n.right && sum + n.value === target) {
      out.push([...cur]);
      hooks.onPath?.([...cur]);
    } else {
      go(n.left, sum + n.value);
      go(n.right, sum + n.value);
    }
    cur.pop();
  };
  go(root, 0);
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
