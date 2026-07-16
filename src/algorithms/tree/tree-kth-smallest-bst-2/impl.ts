export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}
export function buildBST(keys: (number | null)[]): BstNode | null {
  let root: BstNode | null = null;
  for (const k of keys) if (k !== null) root = insert(root, k);
  return root;
}
function insert(root: BstNode | null, key: number): BstNode {
  if (root === null) return new BstNode(key);
  if (key < root.value) root.left = insert(root.left, key);
  else if (key > root.value) root.right = insert(root.right, key);
  return root;
}

export interface KthHooks {
  onVisit?: (v: number) => void;
  onResult?: (v: number | null) => void;
}
export function kthSmallest(root: BstNode | null, k: number, hooks: KthHooks = {}): number | null {
  let result: number | null = null,
    count = 0;
  const go = (n: BstNode | null) => {
    if (!n || result !== null) return;
    go(n.left);
    if (result !== null) return;
    count++;
    hooks.onVisit?.(n.value);
    if (count === k) {
      result = n.value;
      return;
    }
    go(n.right);
  };
  go(root);
  hooks.onResult?.(result);
  return result;
}
