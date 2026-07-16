// =============================================================================
// 尺寸平衡树（Size Balanced Tree, SBT）· 纯算法实现
// 以子树大小为平衡判据，旋转维护不变式。零 DOM 依赖，可独立单测。
// =============================================================================

export interface SBTNode {
  key: number;
  left: SBTNode | null;
  right: SBTNode | null;
  size: number;
}

export interface SBTHooks {
  /** 比较插入 key 与节点 node.key。 */
  onCompare?: (key: number, nodeKey: number) => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number) => void;
  /** 发生旋转（方向 + 新根 key）。 */
  onRotate?: (direction: 'left' | 'right', newRootKey: number) => void;
}

function sz(n: SBTNode | null): number {
  return n === null ? 0 : n.size;
}
function update(n: SBTNode): void {
  n.size = 1 + sz(n.left) + sz(n.right);
}

/** 右旋：以 t 为根，把其左子提为新根。 */
function rotateRight(t: SBTNode, hooks: SBTHooks): SBTNode {
  const l = t.left!;
  t.left = l.right;
  l.right = t;
  update(t);
  update(l);
  hooks.onRotate?.('right', l.key);
  return l;
}

/** 左旋：以 t 为根，把其右子提为新根。 */
function rotateLeft(t: SBTNode, hooks: SBTHooks): SBTNode {
  const r = t.right!;
  t.right = r.left;
  r.left = t;
  update(t);
  update(r);
  hooks.onRotate?.('left', r.key);
  return r;
}

/**
 * maintain(t)：修复 t 子树的尺寸平衡性质。
 * 分四种情形（左子偏大两种、右子偏大两种），递归修复。
 */
function maintain(t: SBTNode, hooks: SBTHooks): SBTNode {
  if (t.left !== null) {
    // LL：size(t.left.left) > size(t.right)
    if (sz(t.left.left) > sz(t.right)) {
      t = rotateRight(t, hooks);
      t.right = maintain(t.right!, hooks);
      t = maintain(t, hooks);
    } else if (sz(t.left.right) > sz(t.right)) {
      // LR：size(t.left.right) > size(t.right)
      t.left = rotateLeft(t.left, hooks);
      t = rotateRight(t, hooks);
      t.left = maintain(t.left!, hooks);
      t.right = maintain(t.right!, hooks);
      t = maintain(t, hooks);
    }
  }
  if (t.right !== null) {
    if (sz(t.right.right) > sz(t.left)) {
      // RR
      t = rotateLeft(t, hooks);
      t.left = maintain(t.left!, hooks);
      t = maintain(t, hooks);
    } else if (sz(t.right.left) > sz(t.left)) {
      // RL
      t.right = rotateRight(t.right, hooks);
      t = rotateLeft(t, hooks);
      t.left = maintain(t.left!, hooks);
      t.right = maintain(t.right!, hooks);
      t = maintain(t, hooks);
    }
  }
  return t;
}

/** 插入 key（去重），返回（可能新的）子树根。 */
export function sbtInsert(t: SBTNode | null, key: number, hooks: SBTHooks = {}): SBTNode {
  if (t === null) {
    hooks.onInsert?.(key);
    return { key, left: null, right: null, size: 1 };
  }
  hooks.onCompare?.(key, t.key);
  if (key === t.key) return t; // 去重
  if (key < t.key) t.left = sbtInsert(t.left, key, hooks);
  else t.right = sbtInsert(t.right, key, hooks);
  update(t);
  return maintain(t, hooks);
}

/** 查找 key 是否存在。 */
export function sbtSearch(t: SBTNode | null, key: number): boolean {
  let cur = t;
  while (cur !== null) {
    if (key === cur.key) return true;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return false;
}

/** 查询第 k 小（1-based）的 key。 */
export function kth(t: SBTNode | null, k: number): number | null {
  if (t === null || k < 1 || k > t.size) return null;
  const r = 1 + sz(t.left);
  if (k === r) return t.key;
  if (k < r) return kth(t.left, k);
  return kth(t.right, k - r);
}

/** 中序遍历（应得升序）。 */
export function inorder(t: SBTNode | null): number[] {
  const out: number[] = [];
  const walk = (n: SBTNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(t);
  return out;
}

/** 计算树高（空树 0）。 */
export function height(t: SBTNode | null): number {
  if (!t) return 0;
  return 1 + Math.max(height(t.left), height(t.right));
}

/** 校验 size 字段正确。 */
export function checkSizes(t: SBTNode | null): boolean {
  if (!t) return true;
  if (!checkSizes(t.left) || !checkSizes(t.right)) return false;
  return t.size === 1 + sz(t.left) + sz(t.right);
}

/** 批量插入构造 SBT，返回根。 */
export function buildSBT(keys: readonly number[], hooks: SBTHooks = {}): SBTNode | null {
  let root: SBTNode | null = null;
  for (const k of keys) {
    root = sbtInsert(root, k, hooks);
  }
  return root;
}
