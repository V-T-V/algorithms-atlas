export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface PathHooks {
  onVisit?: (v: number) => void;
  onResult?: (path: number[] | null) => void;
}
export function pathToNode(
  root: TreeNode | null,
  target: number,
  hooks: PathHooks = {},
): number[] | null {
  const cur: number[] = [];
  const go = (n: TreeNode | null): boolean => {
    if (!n) return false;
    cur.push(n.value);
    hooks.onVisit?.(n.value);
    if (n.value === target) return true;
    if (go(n.left) || go(n.right)) return true;
    cur.pop();
    return false;
  };
  const found = go(root);
  const r = found ? [...cur] : null;
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
