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

export interface MinHooks {
  onVisit?: (v: number) => void;
  onResult?: (v: number | null) => void;
}
export function bstMin(root: BstNode | null, hooks: MinHooks = {}): number | null {
  if (!root) {
    hooks.onResult?.(null);
    return null;
  }
  let node = root;
  while (node.left) {
    hooks.onVisit?.(node.value);
    node = node.left;
  }
  hooks.onVisit?.(node.value);
  hooks.onResult?.(node.value);
  return node.value;
}
