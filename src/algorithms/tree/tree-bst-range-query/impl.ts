// =============================================================================
// BST 范围查询 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface RangeHooks {
  onVisit?: (
    value: number,
    action: 'left' | 'match' | 'right' | 'skip-left' | 'skip-right',
  ) => void;
}

export function rangeQuery(
  root: BstNode | null,
  lo: number,
  hi: number,
  hooks: RangeHooks = {},
): number[] {
  if (lo > hi) throw new RangeError('需要 lo <= hi');
  const out: number[] = [];
  dfs(root, lo, hi, out, hooks);
  return out;
}

function dfs(node: BstNode | null, lo: number, hi: number, out: number[], hooks: RangeHooks): void {
  if (node === null) return;
  if (node.value > lo) {
    hooks.onVisit?.(node.value, 'left');
    dfs(node.left, lo, hi, out, hooks);
  } else {
    hooks.onVisit?.(node.value, 'skip-left');
  }
  if (node.value >= lo && node.value <= hi) {
    hooks.onVisit?.(node.value, 'match');
    out.push(node.value);
  }
  if (node.value < hi) {
    hooks.onVisit?.(node.value, 'right');
    dfs(node.right, lo, hi, out, hooks);
  } else {
    hooks.onVisit?.(node.value, 'skip-right');
  }
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
