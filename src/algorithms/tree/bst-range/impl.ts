// =============================================================================
// BST 区间查询（BST Range Query）· 纯算法实现（零 DOM 依赖，可独立单测）
// 查询 [lo, hi] 内所有值，利用 BST 性质剪枝：跳过不在范围内的子树。
// =============================================================================

/** BST 节点（纯数据，无父指针）。 */
export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RangeHooks {
  /** 访问到一个节点（给出是否在区间内、是否被剪枝）。 */
  onVisit?: (value: number, inRange: boolean) => void;
  /** 剪掉一棵子树（因为整棵子树都 < lo 或 > hi）。 */
  onPrune?: (value: number, side: 'left' | 'right') => void;
}

/**
 * BST 区间查询：返回所有满足 `lo ≤ value ≤ hi` 的值（升序）。
 *
 * 递归中序遍历，但用 BST 性质**剪枝**：
 *
 * - 若 `node.value < lo`：node 及其整个左子树都 < lo → **跳过左子树**，只递归右子树
 * - 若 `node.value > hi`：node 及其整个右子树都 > hi → **跳过右子树**，只递归左子树
 * - 否则：node 在范围内，先递归左子树（更小的）、收录 node、再递归右子树（更大的）
 *
 * 直观理解：BST 的「左小右大」让我们在搜索时像二分一样砍掉整棵无关子树，
 * 不必遍历所有节点。这正是 BST 相对无序数组/普通二叉树的核心优势。
 *
 * **复杂度**：`O(h + k)`，其中 h 为树高、k 为结果数。
 * - 最坏（区间覆盖全部）退化为完整中序 `O(n)`
 * - 区间很窄时仅 `O(h + k)`，远优于 `O(n)` 全扫
 *
 * @param root BST 根
 * @param lo 区间下界（含）
 * @param hi 区间上界（含）
 * @param hooks 可选的事件钩子
 * @returns 区间内的值（升序）
 */
export function bstRange(
  root: BSTNode | null,
  lo: number,
  hi: number,
  hooks: RangeHooks = {},
): number[] {
  const out: number[] = [];
  const walk = (n: BSTNode | null): void => {
    if (!n) return;
    if (n.value < lo) {
      // node 与左子树全 < lo：剪左，只走右
      hooks.onVisit?.(n.value, false);
      hooks.onPrune?.(n.value, 'left');
      walk(n.right);
      return;
    }
    if (n.value > hi) {
      hooks.onVisit?.(n.value, false);
      hooks.onPrune?.(n.value, 'right');
      walk(n.left);
      return;
    }
    // 在范围内：左 → 自身 → 右（中序，保证升序）
    walk(n.left);
    out.push(n.value);
    hooks.onVisit?.(n.value, true);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 顺序插入构建 BST。 */
export function bstInsert(values: readonly number[]): BSTNode | null {
  let root: BSTNode | null = null;
  const insert = (node: BSTNode | null, v: number): BSTNode => {
    if (!node) return { value: v, left: null, right: null };
    if (v < node.value) node.left = insert(node.left, v);
    else if (v > node.value) node.right = insert(node.right, v);
    return node;
  };
  for (const v of values) root = insert(root, v);
  return root;
}
