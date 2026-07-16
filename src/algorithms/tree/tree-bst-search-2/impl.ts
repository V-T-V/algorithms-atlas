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

export interface SearchHooks {
  onCompare?: (cur: number, dir: 'left' | 'right' | 'hit' | 'miss') => void;
  onResult?: (found: boolean) => void;
}
export function bstSearch(root: BstNode | null, key: number, hooks: SearchHooks = {}): boolean {
  let node = root;
  while (node) {
    if (key === node.value) {
      hooks.onCompare?.(node.value, 'hit');
      hooks.onResult?.(true);
      return true;
    }
    if (key < node.value) {
      hooks.onCompare?.(node.value, 'left');
      node = node.left;
    } else {
      hooks.onCompare?.(node.value, 'right');
      node = node.right;
    }
  }
  hooks.onCompare?.(NaN, 'miss');
  hooks.onResult?.(false);
  return false;
}
