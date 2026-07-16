// =============================================================================
// 树堆（树类视角）Treap Tree · 纯算法实现
// 与 ds/treap 的「旋转式」不同，本实现采用「分裂 / 合并」式（自顶向下，无旋转）。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// =============================================================================

/** Treap 节点。priority 越大越靠近根（大顶堆）。 */
export interface TreapTreeNode {
  key: number;
  priority: number;
  left: TreapTreeNode | null;
  right: TreapTreeNode | null;
}

export interface TreapTreeHooks {
  /** 比较 key 与节点 node.key。 */
  onCompare?: (key: number, nodeKey: number) => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number, priority: number) => void;
  /** 发生合并：把 left 与 right 两棵子树合并成一棵。 */
  onMerge?: (leftRoot: number | null, rightRoot: number | null, newRoot: number) => void;
  /** 发生分裂：以 key 为界把一棵树分成左（<=key）右（>key）两棵。 */
  onSplit?: (root: number, key: number) => void;
}

// —— 固定种子 PRNG ——
let seed = 20240601;
function rand(): number {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed;
}
export function resetSeed(s = 20240601): void {
  seed = s;
}

/**
 * 分裂：把以 node 为根的树按 key 分成 (L, R)。
 *   L 中所有 key <= key，R 中所有 key > key。
 */
function split(
  node: TreapTreeNode | null,
  key: number,
  hooks: TreapTreeHooks,
): [TreapTreeNode | null, TreapTreeNode | null] {
  if (node === null) return [null, null];
  hooks.onCompare?.(key, node.key);
  if (node.key <= key) {
    // node 及其左子属于 L，递归分裂右子
    hooks.onSplit?.(node.key, key);
    const [l, r] = split(node.right, key, hooks);
    node.right = l;
    return [node, r];
  }
  hooks.onSplit?.(node.key, key);
  const [l, r] = split(node.left, key, hooks);
  node.left = r;
  return [l, node];
}

/**
 * 合并：把 L 与 R 合成一棵树。要求 L 中所有 key < R 中所有 key。
 * 按堆序（priority 大者为根）决定谁作根。
 */
function merge(
  l: TreapTreeNode | null,
  r: TreapTreeNode | null,
  hooks: TreapTreeHooks,
): TreapTreeNode | null {
  if (l === null) return r;
  if (r === null) return l;
  let root: number;
  if (l.priority > r.priority) {
    // L 作根，其右子与 R 合并
    l.right = merge(l.right, r, hooks);
    root = l.key;
  } else {
    r.left = merge(l, r.left, hooks);
    root = r.key;
  }
  hooks.onMerge?.(l.key, r.key, root);
  return l.priority > r.priority ? l : r;
}

/**
 * 插入：先分裂成 (L, R)（<=key 与 >key），再分裂 L 成 (L1, M)（<key 与 ==key），
 * 若 M 为空则新建节点，最后 merge(L1, M) 再 merge(., R)。
 * 全程无旋转，靠 priority 维持堆形态。
 */
function insertNode(
  root: TreapTreeNode | null,
  key: number,
  priority: number,
  hooks: TreapTreeHooks,
): TreapTreeNode | null {
  const [L, R] = split(root, key, hooks); // L: <=key, R: >key
  const [L1, M] = split(L, key - 1, hooks); // L1: <key, M: ==key
  let newNode = M;
  if (M === null) {
    hooks.onInsert?.(key, priority);
    newNode = { key, priority, left: null, right: null };
  }
  const mergedLeft = merge(L1, newNode, hooks);
  return merge(mergedLeft, R, hooks);
}

/** 顺序插入 keys，返回 Treap 根。优先级由固定种子 PRNG 生成。 */
export function treapTreeInsert(
  keys: readonly number[],
  hooks: TreapTreeHooks = {},
  options: { seed?: number } = {},
): TreapTreeNode | null {
  if (options.seed !== undefined) resetSeed(options.seed);
  let root: TreapTreeNode | null = null;
  for (const k of keys) {
    const p = rand();
    root = insertNode(root, k, p, hooks);
  }
  return root;
}

/** 中序遍历（应得升序）。 */
export function inorder(root: TreapTreeNode | null): number[] {
  const out: number[] = [];
  const walk = (n: TreapTreeNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 校验：BST 序 + 堆序（父 priority >= 子）。 */
export function isTreapTree(root: TreapTreeNode | null): boolean {
  const check = (n: TreapTreeNode | null, min: number, max: number, parentP: number): boolean => {
    if (!n) return true;
    if (n.priority > parentP) return false;
    if (n.key <= min || n.key >= max) return false;
    return check(n.left, min, n.key, n.priority) && check(n.right, n.key, max, n.priority);
  };
  return check(root, -Infinity, Infinity, Infinity);
}
