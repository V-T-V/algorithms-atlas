export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface SecMinHooks {
  onCand?: (v: number) => void;
  onResult?: (v: number) => void;
}
export function findSecondMinimumValue(root: TreeNode | null, hooks: SecMinHooks = {}): number {
  if (!root) return -1;
  const min = root.value;
  let second = Infinity;
  const go = (n: TreeNode | null) => {
    if (!n) return;
    if (n.value > min && n.value < second) {
      second = n.value;
      hooks.onCand?.(n.value);
    }
    if (n.value === min) {
      go(n.left);
      go(n.right);
    }
  };
  go(root);
  const r = second === Infinity ? -1 : second;
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
