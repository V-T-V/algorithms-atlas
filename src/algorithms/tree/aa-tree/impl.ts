// =============================================================================
// AA 树（AA Tree）· 纯算法实现
// 用 level 代替颜色，只允许右倾红节点；skew/split 维护。零 DOM 依赖，可独立单测。
// =============================================================================

export interface AANode {
  key: number;
  level: number;
  left: AANode | null;
  right: AANode | null;
}
export interface AATreeHooks {
  /** 比较插入 key 与节点 node.key。 */
  onCompare?: (key: number, nodeKey: number) => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number) => void;
  /** 发生 skew（右旋修复左倾）。 */
  onSkew?: (atKey: number) => void;
  /** 发生 split（左旋 + 提 level）。 */
  onSplit?: (atKey: number) => void;
}

/** 创建叶子节点（level=1）。 */
function makeNode(key: number): AANode {
  return { key, level: 1, left: null, right: null };
}

/** skew：若 node 有左子且左子 level == node.level，右旋 node。 */
function skew(t: AANode | null, hooks: AATreeHooks): AANode | null {
  if (t === null) return null;
  if (t.left !== null && t.left.level === t.level) {
    const l = t.left;
    t.left = l.right;
    l.right = t;
    hooks.onSkew?.(t.key);
    return l;
  }
  return t;
}

/** split：若 node 有右子的右子且 level == node.level，左旋并提 level。 */
function split(t: AANode | null, hooks: AATreeHooks): AANode | null {
  if (t === null) return null;
  if (t.right !== null && t.right.right !== null && t.right.right.level === t.level) {
    const r = t.right;
    t.right = r.left;
    r.left = t;
    r.level++;
    hooks.onSplit?.(r.key);
    return r;
  }
  return t;
}

/** 插入 key（去重），返回（可能新的）子树根。 */
export function aaInsert(t: AANode | null, key: number, hooks: AATreeHooks = {}): AANode {
  if (t === null) {
    hooks.onInsert?.(key);
    return makeNode(key);
  }
  hooks.onCompare?.(key, t.key);
  if (key === t.key) return t; // 去重
  if (key < t.key) t.left = aaInsert(t.left, key, hooks);
  else t.right = aaInsert(t.right, key, hooks);

  t = skew(t, hooks)!;
  t = split(t, hooks)!;
  return t;
}

/** 查找 key 是否存在。 */
export function aaSearch(t: AANode | null, key: number): boolean {
  let cur = t;
  while (cur !== null) {
    if (key === cur.key) return true;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return false;
}

/** 中序遍历（应得升序）。 */
export function inorder(t: AANode | null): number[] {
  const out: number[] = [];
  const walk = (n: AANode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(t);
  return out;
}

/** 计算树高（空树 0）。 */
export function height(t: AANode | null): number {
  if (!t) return 0;
  return 1 + Math.max(height(t.left), height(t.right));
}

/** 校验是否 BST。 */
export function isBST(t: AANode | null): boolean {
  const check = (n: AANode | null, lo: number, hi: number): boolean => {
    if (!n) return true;
    if (n.key <= lo || n.key >= hi) return false;
    return check(n.left, lo, n.key) && check(n.right, n.key, hi);
  };
  return check(t, -Infinity, Infinity);
}

/** 校验 AA 性质：左子 level < 本节点 level。 */
export function isAATree(t: AANode | null): boolean {
  const check = (n: AANode | null): boolean => {
    if (!n) return true;
    // 左子 level 必须严格小于本节点
    if (n.left !== null && n.left.level >= n.level) return false;
    // 右子的右子不能与本节点同 level（split 后应有切分）
    if (n.right !== null && n.right.right !== null && n.right.right.level === n.level) return false;
    return check(n.left) && check(n.right);
  };
  return check(t);
}

/** 批量插入构造 AA 树，返回根。 */
export function buildAA(keys: readonly number[], hooks: AATreeHooks = {}): AANode | null {
  let root: AANode | null = null;
  for (const k of keys) {
    root = aaInsert(root, k, hooks);
  }
  return root;
}
