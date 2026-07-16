// 树排序（平衡 BST 中序）· 纯算法实现
export interface TreeBstHooks {
  onVisit?: (value: number, arr: number[]) => void;
}

interface N {
  v: number;
  l: N | null;
  r: N | null;
}

function buildBalanced(sorted: number[], lo: number, hi: number): N | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >>> 1;
  return {
    v: sorted[mid]!,
    l: buildBalanced(sorted, lo, mid - 1),
    r: buildBalanced(sorted, mid + 1, hi),
  };
}

function inorder(n: N | null, out: number[], hooks: TreeBstHooks): void {
  if (!n) return;
  inorder(n.l, out, hooks);
  out.push(n.v);
  hooks.onVisit?.(n.v, out);
  inorder(n.r, out, hooks);
}

export function treeSortBst(arr: readonly number[], hooks: TreeBstHooks = {}): number[] {
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const root = buildBalanced(sorted, 0, sorted.length - 1);
  const out: number[] = [];
  inorder(root, out, hooks);
  return out;
}
