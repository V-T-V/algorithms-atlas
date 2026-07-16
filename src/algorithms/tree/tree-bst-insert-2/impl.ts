export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}
export function buildBST(keys: number[]): BstNode | null {
  let root: BstNode | null = null;
  for (const k of keys) root = insert(root, k);
  return root;
}
function insert(root: BstNode | null, key: number): BstNode {
  if (root === null) return new BstNode(key);
  if (key < root.value) root.left = insert(root.left, key);
  else if (key > root.value) root.right = insert(root.right, key);
  return root;
}

export interface InsertHooks {
  onCompare?: (cur: number, dir: 'left' | 'right') => void;
  onResult?: (root: BstNode | null) => void;
}
export { insert as bstInsert };
export function insertTracked(
  root: BstNode | null,
  key: number,
  hooks: InsertHooks = {},
): BstNode | null {
  const go = (n: BstNode | null): BstNode => {
    if (n === null) return new BstNode(key);
    if (key < n.value) {
      hooks.onCompare?.(n.value, 'left');
      n.left = go(n.left);
    } else if (key > n.value) {
      hooks.onCompare?.(n.value, 'right');
      n.right = go(n.right);
    }
    return n;
  };
  const r = go(root);
  hooks.onResult?.(r);
  return r;
}
