// =============================================================================
// 旋转式 Treap（Treap, rotating）· 纯算法实现
// BST 按键 + 堆按随机优先级，插入/删除用旋转维护。零 DOM 依赖，可独立单测。
// =============================================================================

export interface TreapNode {
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

export interface TreapDSHooks {
  onCompare?: (key: number, nodeKey: number) => void;
  onInsert?: (key: number, priority: number) => void;
  onRotate?: (direction: 'left' | 'right', atKey: number) => void;
  onDelete?: (key: number) => void;
}

let seed = 20240601;
function rand(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed;
}
export function resetSeed(s = 20240601): void {
  seed = s;
}

/** 右旋：以 t 为根，把左子提为新根。 */
function rotateRight(t: TreapNode, hooks: TreapDSHooks): TreapNode {
  const l = t.left!;
  t.left = l.right;
  l.right = t;
  hooks.onRotate?.('right', l.key);
  return l;
}
/** 左旋：以 t 为根，把右子提为新根。 */
function rotateLeft(t: TreapNode, hooks: TreapDSHooks): TreapNode {
  const r = t.right!;
  t.right = r.left;
  r.left = t;
  hooks.onRotate?.('left', r.key);
  return r;
}

/** 插入 key（去重），返回新根。期望 O(log n)。 */
export function treapInsert(t: TreapNode | null, key: number, hooks: TreapDSHooks = {}): TreapNode {
  if (t === null) {
    const p = rand();
    hooks.onInsert?.(key, p);
    return { key, priority: p, left: null, right: null };
  }
  hooks.onCompare?.(key, t.key);
  if (key < t.key) {
    t.left = treapInsert(t.left, key, hooks);
    if (t.left!.priority > t.priority) {
      t = rotateRight(t, hooks);
    }
  } else if (key > t.key) {
    t.right = treapInsert(t.right, key, hooks);
    if (t.right!.priority > t.priority) {
      t = rotateLeft(t, hooks);
    }
  }
  // key === t.key：去重，不变
  return t;
}

/** 删除 key，返回新根。期望 O(log n)。 */
export function treapDelete(
  t: TreapNode | null,
  key: number,
  hooks: TreapDSHooks = {},
): TreapNode | null {
  if (t === null) return null;
  hooks.onCompare?.(key, t.key);
  if (key < t.key) {
    t.left = treapDelete(t.left, key, hooks);
    return t;
  }
  if (key > t.key) {
    t.right = treapDelete(t.right, key, hooks);
    return t;
  }
  // 命中：把节点旋到叶子
  hooks.onDelete?.(key);
  if (t.left === null) return t.right;
  if (t.right === null) return t.left;
  // 两子都有：把优先级大的子提上来
  if (t.left.priority > t.right.priority) {
    t = rotateRight(t, hooks);
    t.right = treapDelete(t.right, key, hooks);
    return t;
  }
  t = rotateLeft(t, hooks);
  t.left = treapDelete(t.left, key, hooks);
  return t;
}

/** 查找 key 是否存在。 */
export function treapSearch(t: TreapNode | null, key: number): boolean {
  let cur = t;
  while (cur !== null) {
    if (key === cur.key) return true;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return false;
}

/** 中序遍历（应得升序）。 */
export function inorder(t: TreapNode | null): number[] {
  const out: number[] = [];
  const walk = (n: TreapNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(t);
  return out;
}

/** 计算树高（空树 0）。 */
export function height(t: TreapNode | null): number {
  if (!t) return 0;
  return 1 + Math.max(height(t.left), height(t.right));
}

/** 校验：BST 序 + 堆序（父 priority >= 子）。 */
export function isTreap(t: TreapNode | null): boolean {
  const check = (n: TreapNode | null, min: number, max: number, parentP: number): boolean => {
    if (!n) return true;
    if (n.priority > parentP) return false;
    if (n.key <= min || n.key >= max) return false;
    return check(n.left, min, n.key, n.priority) && check(n.right, n.key, max, n.priority);
  };
  return check(t, -Infinity, Infinity, Infinity);
}

/** 批量插入构造 Treap，返回根。 */
export function buildTreap(
  keys: readonly number[],
  hooks: TreapDSHooks = {},
  options: { seed?: number } = {},
): TreapNode | null {
  if (options.seed !== undefined) resetSeed(options.seed);
  let root: TreapNode | null = null;
  for (const k of keys) {
    root = treapInsert(root, k, hooks);
  }
  return root;
}
