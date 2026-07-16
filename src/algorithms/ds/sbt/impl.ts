// =============================================================================
// 尺寸平衡树 Size Balanced Tree (SBT) · 纯算法实现
// 用子树大小作为平衡判据：对任意节点，size(兄弟) >= size(叔伯)。
// 通过旋转维持。零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作。
// =============================================================================

/** SBT 节点（带子树大小 size）。 */
export interface SBTNode {
  key: number;
  size: number; // 以本节点为根的子树节点数
  left: SBTNode | null;
  right: SBTNode | null;
}

export interface SBTHooks {
  /** 比较 key 与节点 node.key（dir: 'left' | 'right'）。 */
  onCompare?: (key: number, nodeKey: number, dir: 'left' | 'right') => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number) => void;
  /** 发生旋转：'left' 或 'right'，围绕 pivotKey。 */
  onRotate?: (type: 'left' | 'right', pivotKey: number) => void;
}

function size(n: SBTNode | null): number {
  return n ? n.size : 0;
}

function update(n: SBTNode): void {
  n.size = 1 + size(n.left) + size(n.right);
}

/** 右旋：以 t 为根，左子 l 提升为新根。 */
function rotateRight(t: SBTNode): SBTNode {
  const l = t.left!;
  t.left = l.right;
  l.right = t;
  update(t);
  update(l);
  return l;
}

/** 左旋：以 t 为根，右子 r 提升为新根。 */
function rotateLeft(t: SBTNode): SBTNode {
  const r = t.right!;
  t.right = r.left;
  r.left = t;
  update(t);
  update(r);
  return r;
}

/**
 * 维护 SBT 平衡性质（Maintain）。
 * 经典 SBT 维护：插入后检查，若叔伯子树比兄弟子树大则旋转。
 *   - Case LL：size(left.left) > size(right) → 右旋 t，再 maintain(t.right) 与 maintain(t)
 *   - Case LR：size(left.right) > size(right) → 左旋 t.left，右旋 t，再 maintain 两个子树
 *   - 右侧 RR / RL 对称
 * 注意：分支内的递归 maintain 仅在对应子树非空时进行。
 */
function maintain(t: SBTNode, hooks: SBTHooks): SBTNode {
  const sl = size(t.left);
  const sr = size(t.right);
  if (sl > sr) {
    const l = t.left!;
    // Case LL
    if (size(l.left) > sr) {
      hooks.onRotate?.('right', t.key);
      t = rotateRight(t);
      if (t.right) t.right = maintain(t.right, hooks);
      t = maintain(t, hooks);
    } else if (size(l.right) > sr) {
      // Case LR
      hooks.onRotate?.('left', l.key);
      t.left = rotateLeft(l);
      hooks.onRotate?.('right', t.key);
      t = rotateRight(t);
      if (t.left) t.left = maintain(t.left, hooks);
      if (t.right) t.right = maintain(t.right, hooks);
      t = maintain(t, hooks);
    }
  } else if (sr > sl) {
    const r = t.right!;
    // Case RR
    if (size(r.right) > sl) {
      hooks.onRotate?.('left', t.key);
      t = rotateLeft(t);
      if (t.left) t.left = maintain(t.left, hooks);
      t = maintain(t, hooks);
    } else if (size(r.left) > sl) {
      // Case RL
      hooks.onRotate?.('right', r.key);
      t.right = rotateRight(r);
      hooks.onRotate?.('left', t.key);
      t = rotateLeft(t);
      if (t.left) t.left = maintain(t.left, hooks);
      if (t.right) t.right = maintain(t.right, hooks);
      t = maintain(t, hooks);
    }
  }
  return t;
}

function insertNode(node: SBTNode | null, key: number, hooks: SBTHooks): SBTNode {
  if (node === null) {
    hooks.onInsert?.(key);
    return { key, size: 1, left: null, right: null };
  }
  if (key < node.key) {
    hooks.onCompare?.(key, node.key, 'left');
    node.left = insertNode(node.left, key, hooks);
  } else if (key > node.key) {
    hooks.onCompare?.(key, node.key, 'right');
    node.right = insertNode(node.right, key, hooks);
  } else {
    return node; // 重复不插入
  }
  update(node);
  return maintain(node, hooks);
}

/** 顺序插入 keys，返回 SBT 根。 */
export function sbtInsert(keys: readonly number[], hooks: SBTHooks = {}): SBTNode | null {
  let root: SBTNode | null = null;
  for (const k of keys) {
    root = insertNode(root, k, hooks);
  }
  return root;
}

/** 中序遍历（应得升序）。 */
export function inorder(root: SBTNode | null): number[] {
  const out: number[] = [];
  const walk = (n: SBTNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** size 字段是否自洽。 */
export function sizesValid(root: SBTNode | null): boolean {
  const check = (n: SBTNode | null): number => {
    if (!n) return 0;
    const l = check(n.left);
    const r = check(n.right);
    if (n.size !== 1 + l + r) return -1;
    return n.size;
  };
  return check(root) >= 0;
}

/** 校验 SBT 平衡性质：对每个节点，叔伯 size <= 兄弟 size。 */
export function isSBT(root: SBTNode | null): boolean {
  const ok = (n: SBTNode | null): boolean => {
    if (!n) return true;
    const sl = size(n.left);
    const sr = size(n.right);
    // BST 序
    if (n.left && n.left.key >= n.key) return false;
    if (n.right && n.right.key <= n.key) return false;
    // SBT 性质：size(兄弟) >= size(叔伯)
    if (n.left) {
      if (size(n.left.left) > sr) return false;
      if (size(n.left.right) > sr) return false;
    }
    if (n.right) {
      if (size(n.right.right) > sl) return false;
      if (size(n.right.left) > sl) return false;
    }
    return ok(n.left) && ok(n.right);
  };
  return ok(root);
}
