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

export interface DelHooks {
  onCase?: (caseType: 'leaf' | 'one-child' | 'two-child') => void;
  onResult?: (root: BstNode | null) => void;
}
function minNode(n: BstNode): BstNode {
  while (n.left) n = n.left;
  return n;
}
export function bstDelete(root: BstNode | null, key: number, hooks: DelHooks = {}): BstNode | null {
  if (!root) return null;
  if (key < root.value) root.left = bstDelete(root.left, key, hooks);
  else if (key > root.value) root.right = bstDelete(root.right, key, hooks);
  else {
    if (!root.left && !root.right) {
      hooks.onCase?.('leaf');
      return null;
    }
    if (!root.left) {
      hooks.onCase?.('one-child');
      return root.right;
    }
    if (!root.right) {
      hooks.onCase?.('one-child');
      return root.left;
    }
    hooks.onCase?.('two-child');
    const succ = minNode(root.right);
    root.value = succ.value;
    root.right = bstDelete(root.right, succ.value, hooks);
  }
  hooks.onResult?.(root);
  return root;
}
