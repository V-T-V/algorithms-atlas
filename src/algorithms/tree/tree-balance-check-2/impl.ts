export class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null,
  ) {}
}
export interface CompleteHooks {
  onVisit?: (v: number | null) => void;
  onResult?: (c: boolean) => void;
}
export function isCompleteTree(root: TreeNode | null, hooks: CompleteHooks = {}): boolean {
  if (!root) return true;
  const q: Array<TreeNode | null> = [root];
  let seenNull = false;
  while (q.length) {
    const node = q.shift()!;
    hooks.onVisit?.(node?.value ?? null);
    if (!node) {
      seenNull = true;
      continue;
    }
    if (seenNull) {
      hooks.onResult?.(false);
      return false;
    }
    q.push(node.left);
    q.push(node.right);
  }
  hooks.onResult?.(true);
  return true;
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
