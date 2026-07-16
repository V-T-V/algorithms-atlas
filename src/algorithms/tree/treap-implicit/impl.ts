// =============================================================================
// 隐式 Treap（Implicit Treap）· 纯算法实现
// 无键，按位置（中序下标）操作。split/merge + 懒反转。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ITreapNode {
  value: number;
  priority: number;
  size: number;
  rev: boolean; // 懒反转标记
  left: ITreapNode | null;
  right: ITreapNode | null;
}

export interface ImplicitTreapHooks {
  /** 发生 split（按前 k 个节点切分）。 */
  onSplit?: (rootValue: number | null, k: number) => void;
  /** 发生 merge（合并两棵树）。 */
  onMerge?: (leftValue: number | null, rightValue: number | null) => void;
  /** 翻转某个节点的 children（apply lazy）。 */
  onReverse?: (rootValue: number) => void;
}

let seed = 20240601;
function rand(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed;
}
export function resetSeed(s = 20240601): void {
  seed = s;
}

function sz(n: ITreapNode | null): number {
  return n === null ? 0 : n.size;
}
function update(n: ITreapNode): void {
  n.size = 1 + sz(n.left) + sz(n.right);
}
/** 下推懒反转标记。 */
function pushDown(n: ITreapNode | null, hooks: ImplicitTreapHooks): void {
  if (n === null || !n.rev) return;
  n.rev = false;
  const t = n.left;
  n.left = n.right;
  n.right = t;
  if (n.left) n.left.rev = !n.left.rev;
  if (n.right) n.right.rev = !n.right.rev;
  hooks.onReverse?.(n.value);
}

/** split(t, k)：把前 k 个节点分到 L，其余分到 R。 */
export function split(
  t: ITreapNode | null,
  k: number,
  hooks: ImplicitTreapHooks = {},
): [ITreapNode | null, ITreapNode | null] {
  if (t === null) return [null, null];
  pushDown(t, hooks);
  hooks.onSplit?.(t.value, k);
  const leftSize = sz(t.left);
  if (k <= leftSize) {
    const [l, r] = split(t.left, k, hooks);
    t.left = r;
    update(t);
    return [l, t];
  }
  const [l, r] = split(t.right, k - leftSize - 1, hooks);
  t.right = l;
  update(t);
  return [t, r];
}

/** merge(l, r)：合并两棵树。 */
export function merge(
  l: ITreapNode | null,
  r: ITreapNode | null,
  hooks: ImplicitTreapHooks = {},
): ITreapNode | null {
  if (l === null) return r;
  if (r === null) return l;
  let root: ITreapNode;
  if (l.priority > r.priority) {
    pushDown(l, hooks);
    l.right = merge(l.right, r, hooks);
    root = l;
  } else {
    pushDown(r, hooks);
    r.left = merge(l, r.left, hooks);
    root = r;
  }
  hooks.onMerge?.(l.value, r.value);
  update(root);
  return root;
}

/** 在位置 pos（0-based）插入 value。 */
export function implicitInsert(
  root: ITreapNode | null,
  pos: number,
  value: number,
  hooks: ImplicitTreapHooks = {},
): ITreapNode {
  const node: ITreapNode = {
    value,
    priority: rand(),
    size: 1,
    rev: false,
    left: null,
    right: null,
  };
  const [l, r] = split(root, pos, hooks);
  return merge(merge(l, node, hooks), r, hooks)!;
}

/** 删除位置 pos（0-based）的节点，返回新根。 */
export function implicitDelete(
  root: ITreapNode | null,
  pos: number,
  hooks: ImplicitTreapHooks = {},
): ITreapNode | null {
  const [l, mid1] = split(root, pos, hooks);
  const [, r] = split(mid1, 1, hooks);
  void mid1;
  return merge(l, r, hooks);
}

/** 反转区间 [lo, hi]（0-based，闭区间）。 */
export function implicitReverse(
  root: ITreapNode | null,
  lo: number,
  hi: number,
  hooks: ImplicitTreapHooks = {},
): ITreapNode | null {
  const [l, mid1] = split(root, lo, hooks);
  const [mid, r] = split(mid1, hi - lo + 1, hooks);
  if (mid !== null) mid.rev = !mid.rev;
  return merge(merge(l, mid, hooks), r, hooks);
}

/** 取位置 pos（0-based）的值。 */
export function implicitAt(root: ITreapNode | null, pos: number): number | null {
  let cur = root;
  let k = pos;
  while (cur !== null) {
    const leftSize = sz(cur.left);
    if (k === leftSize) return cur.value;
    if (k < leftSize) {
      cur = cur.left;
    } else {
      k -= leftSize + 1;
      cur = cur.right;
    }
  }
  return null;
}

/** 把整棵树按中序拍平成数组。 */
export function toArray(root: ITreapNode | null): number[] {
  const out: number[] = [];
  const walk = (n: ITreapNode | null): void => {
    if (n === null) return;
    pushDown(n, {});
    walk(n.left);
    out.push(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 从数组构建隐式 Treap。 */
export function buildImplicit(
  values: readonly number[],
  hooks: ImplicitTreapHooks = {},
): ITreapNode | null {
  let root: ITreapNode | null = null;
  for (let i = 0; i < values.length; i++) {
    root = implicitInsert(root, i, values[i]!, hooks);
  }
  return root;
}
