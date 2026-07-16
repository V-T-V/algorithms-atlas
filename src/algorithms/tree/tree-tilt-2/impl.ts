export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface TiltHooks {
  onNode?: (v: number, tilt: number) => void;
  onResult?: (total: number) => void;
}
export function findTilt(root: TreeNode | null, hooks: TiltHooks = {}): number {
  let total = 0;
  const sum = (n: TreeNode | null): number => {
    if (!n) return 0;
    const l = sum(n.left),
      r = sum(n.right);
    const tilt = Math.abs(l - r);
    total += tilt;
    hooks.onNode?.(n.value, tilt);
    return n.value + l + r;
  };
  sum(root);
  hooks.onResult?.(total);
  return total;
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
