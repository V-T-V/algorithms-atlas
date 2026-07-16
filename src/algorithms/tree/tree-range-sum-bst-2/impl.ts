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

export interface RangeHooks {
  onVisit?: (v: number, inRange: boolean) => void;
  onResult?: (sum: number) => void;
}
export function rangeSumBST(
  root: BstNode | null,
  lo: number,
  hi: number,
  hooks: RangeHooks = {},
): number {
  const go = (n: BstNode | null): number => {
    if (!n) return 0;
    const inRange = n.value >= lo && n.value <= hi;
    hooks.onVisit?.(n.value, inRange);
    let s = 0;
    if (n.value > lo) s += go(n.left);
    if (inRange) s += n.value;
    if (n.value < hi) s += go(n.right);
    return s;
  };
  const s = go(root);
  hooks.onResult?.(s);
  return s;
}
