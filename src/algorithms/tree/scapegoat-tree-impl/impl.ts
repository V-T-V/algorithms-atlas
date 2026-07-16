// =============================================================================
// 替罪羊树（Scapegoat Tree）· 纯算法实现
// 不存平衡信息；失衡时找出「替罪羊」子树整体重建。零 DOM 依赖，可独立单测。
// =============================================================================

export interface SGNode {
  key: number;
  left: SGNode | null;
  right: SGNode | null;
  size: number; // 以本节点为根的子树大小
}

export interface ScapegoatTreeHooks {
  /** 比较插入 key 与节点 node.key。 */
  onCompare?: (key: number, nodeKey: number) => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number) => void;
  /** 找到替罪羊：子树 size 超过 α·父节点 size。 */
  onScapegoat?: (nodeKey: number, childSize: number, parentSize: number) => void;
  /** 重建了以某 key 为根的子树。 */
  onRebuild?: (rootKey: number, subtreeSize: number) => void;
}

const ALPHA = 0.7; // 松弛因子

function nodeSize(n: SGNode | null): number {
  return n === null ? 0 : n.size;
}
function updateSize(n: SGNode): void {
  n.size = 1 + nodeSize(n.left) + nodeSize(n.right);
}

/** 中序展开子树为有序数组。 */
function flatten(n: SGNode | null, out: SGNode[]): void {
  if (n === null) return;
  flatten(n.left, out);
  out.push(n);
  flatten(n.right, out);
}

/** 把有序数组 arr[lo..hi) 重建为完美平衡子树，返回新根。 */
function buildBalanced(arr: SGNode[], lo: number, hi: number): SGNode | null {
  if (lo >= hi) return null;
  const mid = (lo + hi) >> 1;
  const node = arr[mid]!;
  node.left = buildBalanced(arr, lo, mid);
  node.right = buildBalanced(arr, mid + 1, hi);
  updateSize(node);
  return node;
}

/** 重建以 node 为根的子树。 */
function rebuild(node: SGNode, hooks: ScapegoatTreeHooks): SGNode {
  const arr: SGNode[] = [];
  flatten(node, arr);
  hooks.onRebuild?.(arr[Math.floor(arr.length / 2)]!.key, arr.length);
  const root = buildBalanced(arr, 0, arr.length);
  // buildBalanced 保证返回非空（arr 非空）
  return root!;
}

/**
 * 插入 key（去重）。若触发失衡，沿路径找出最高替罪羊并重建。
 * 时间均摊 O(log n)，空间 O(n)。
 */
export function scapegoatInsert(
  root: SGNode | null,
  key: number,
  hooks: ScapegoatTreeHooks = {},
): SGNode {
  const stack: SGNode[] = [];
  let cur = root;
  let parent: SGNode | null = null;
  // 1. BST 插入（同时记录路径）
  const newNode: SGNode = { key, left: null, right: null, size: 1 };
  if (root === null) {
    hooks.onInsert?.(key);
    return newNode;
  }
  while (cur !== null) {
    stack.push(cur);
    parent = cur;
    hooks.onCompare?.(key, cur.key);
    if (key === cur.key) return root; // 已存在
    cur = key < cur.key ? cur.left : cur.right;
  }
  // 挂载新节点
  if (parent !== null) {
    if (key < parent.key) parent.left = newNode;
    else parent.right = newNode;
  }
  hooks.onInsert?.(key);

  // 2. 回溯更新 size 并找替罪羊
  let scapegoat: SGNode | null = null;
  for (let i = stack.length - 1; i >= 0; i--) {
    const n = stack[i]!;
    updateSize(n);
    const ls = nodeSize(n.left);
    const rs = nodeSize(n.right);
    if (ls > ALPHA * n.size || rs > ALPHA * n.size) {
      hooks.onScapegoat?.(n.key, Math.max(ls, rs), n.size);
      scapegoat = n;
      // 记录其父（stack 中前一个）
      // 继续回溯更新上面的 size（重建后再整体更新一次）
    }
  }

  if (scapegoat === null) return root;

  // 3. 重建替罪羊子树并重新挂载到父
  const sgIdx = stack.indexOf(scapegoat);
  const sgParent = sgIdx > 0 ? stack[sgIdx - 1]! : null;
  const newSub = rebuild(scapegoat, hooks);
  if (sgParent === null) {
    // 替罪羊是根
    return newSub;
  }
  if (sgParent.left === scapegoat) sgParent.left = newSub;
  else sgParent.right = newSub;
  return root;
}

/** 查找 key 是否存在。 */
export function scapegoatSearch(root: SGNode | null, key: number): boolean {
  let cur = root;
  while (cur !== null) {
    if (key === cur.key) return true;
    cur = key < cur.key ? cur.left : cur.right;
  }
  return false;
}

/** 中序遍历（应得升序）。 */
export function inorder(root: SGNode | null): number[] {
  const out: number[] = [];
  const walk = (n: SGNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.key);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 计算树高（空树 0）。 */
export function height(root: SGNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}

/** 校验是否 BST。 */
export function isBST(root: SGNode | null): boolean {
  const check = (n: SGNode | null, lo: number, hi: number): boolean => {
    if (!n) return true;
    if (n.key <= lo || n.key >= hi) return false;
    return check(n.left, lo, n.key) && check(n.right, n.key, hi);
  };
  return check(root, -Infinity, Infinity);
}

/** 批量插入构造替罪羊树，返回根。 */
export function buildScapegoat(
  keys: readonly number[],
  hooks: ScapegoatTreeHooks = {},
): SGNode | null {
  let root: SGNode | null = null;
  for (const k of keys) {
    root = scapegoatInsert(root, k, hooks);
  }
  return root;
}
