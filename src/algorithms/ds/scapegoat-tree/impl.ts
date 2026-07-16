// =============================================================================
// 替罪羊树 Scapegoat Tree · 纯算法实现
// α 平衡：对每个节点 size(child) <= α·size(node)。失衡时找到替罪羊子树整体重建。
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作。
// =============================================================================

/** 替罪羊树节点。 */
export interface SGNode {
  key: number;
  left: SGNode | null;
  right: SGNode | null;
}

export interface ScapegoatHooks {
  /** 比较 key 与节点 node.key（dir: 'left' | 'right'）。 */
  onCompare?: (key: number, nodeKey: number, dir: 'left' | 'right') => void;
  /** 插入了一个新节点。 */
  onInsert?: (key: number) => void;
  /** 找到替罪羊节点（子树失衡），将整体重建。 */
  onRebuild?: (scapegoatKey: number, subtreeSize: number) => void;
}

function size(n: SGNode | null): number {
  if (!n) return 0;
  return 1 + size(n.left) + size(n.right);
}

/** α 平衡判定：子节点 size <= α * 父 size。 */
function isAlphaBalanced(node: SGNode, alpha: number): boolean {
  const s = 1 + size(node.left) + size(node.right);
  return size(node.left) <= alpha * s && size(node.right) <= alpha * s;
}

/** 把子树拍平成有序数组。 */
function flatten(node: SGNode | null, out: SGNode[]): void {
  if (!node) return;
  flatten(node.left, out);
  out.push(node);
  flatten(node.right, out);
}

/** 由有序节点数组重建平衡 BST，返回新子树根。 */
function buildBalanced(nodes: SGNode[], lo: number, hi: number): SGNode | null {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  const root = nodes[mid]!;
  root.left = buildBalanced(nodes, lo, mid - 1);
  root.right = buildBalanced(nodes, mid + 1, hi);
  return root;
}

/** 重建以 node 为根的子树为完美平衡 BST。 */
function rebuild(node: SGNode, hooks: ScapegoatHooks): SGNode {
  const nodes: SGNode[] = [];
  flatten(node, nodes);
  hooks.onRebuild?.(node.key, nodes.length);
  const newRoot = buildBalanced(nodes, 0, nodes.length - 1);
  return newRoot ?? node;
}

/** 插入到子树 node，返回新子树根；路径上发现失衡替罪羊则重建。 */
function insertNode(
  node: SGNode | null,
  key: number,
  alpha: number,
  hooks: ScapegoatHooks,
): SGNode {
  if (node === null) {
    hooks.onInsert?.(key);
    return { key, left: null, right: null };
  }
  if (key < node.key) {
    hooks.onCompare?.(key, node.key, 'left');
    node.left = insertNode(node.left, key, alpha, hooks);
  } else if (key > node.key) {
    hooks.onCompare?.(key, node.key, 'right');
    node.right = insertNode(node.right, key, alpha, hooks);
  } else {
    return node; // 重复不插入
  }
  // 插入后检查本节点是否 α 失衡，是则为替罪羊 → 重建
  if (!isAlphaBalanced(node, alpha)) {
    return rebuild(node, hooks);
  }
  return node;
}

/** 顺序插入 keys，返回替罪羊树根。alpha 默认 0.7。 */
export function scapegoatInsert(
  keys: readonly number[],
  hooks: ScapegoatHooks = {},
  options: { alpha?: number } = {},
): SGNode | null {
  const alpha = options.alpha ?? 0.7;
  let root: SGNode | null = null;
  for (const k of keys) {
    root = insertNode(root, k, alpha, hooks);
  }
  return root;
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

/** 校验：BST 序 + α 平衡。 */
export function isScapegoat(root: SGNode | null, alpha = 0.7): boolean {
  const ok = (n: SGNode | null): boolean => {
    if (!n) return true;
    if (n.left && n.left.key >= n.key) return false;
    if (n.right && n.right.key <= n.key) return false;
    if (!isAlphaBalanced(n, alpha)) return false;
    return ok(n.left) && ok(n.right);
  };
  return ok(root);
}
