// =============================================================================
// 二叉树层序遍历（Level Order Traversal / BFS）· 纯算法实现（零 DOM 依赖，可独立单测）
// 按层自顶向下、同层从左到右访问。用队列实现。
// =============================================================================

/** 二叉树节点（纯数据，无父指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LevelHooks {
  /** 访问一个节点（输出它），给出它所在的层（0-based）。 */
  onVisit?: (value: number, level: number) => void;
}

/**
 * 层序遍历（广度优先 BFS）：按层自顶向下、同层从左到右。
 *
 * 用队列实现：根入队，循环「出队 → 访问 → 左右子节点入队」直到队空。
 * 常用变体是逐层分组（用「本层节点数」控制一层的循环）。
 *
 * **特点**：
 * - 是树的**广度优先搜索**，最先访问离根最近的节点
 * - 用于求「**最小深度**」「**到根的最短距离**」（无权图 BFS 的树版本）
 * - 序列化二叉树（LeetCode 风格 `[1,2,3,null,...]`）正是层序
 * - 逐层处理适合「按层聚合」的问题（如每层最大值、之字形打印）
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 展平的层序访问序列
 */
export function binaryTreeLevel(root: BTNode | null, hooks: LevelHooks = {}): number[] {
  if (!root) return [];
  const out: number[] = [];
  const queue: Array<{ node: BTNode; level: number }> = [{ node: root, level: 0 }];
  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    out.push(node.value);
    hooks.onVisit?.(node.value, level);
    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }
  return out;
}

/** 层序遍历（逐层分组版）：返回每层的节点值数组。 */
export function binaryTreeLevelGrouped(root: BTNode | null, hooks: LevelHooks = {}): number[][] {
  if (!root) return [];
  const levels: number[][] = [];
  const queue: BTNode[] = [root];
  let level = 0;
  while (queue.length > 0) {
    const size = queue.length;
    const row: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      row.push(node.value);
      hooks.onVisit?.(node.value, level);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(row);
    level++;
  }
  return levels;
}

/** 从层序数组（含 null 表示缺位）构建二叉树。 */
export function buildTree(values: Array<number | null>): BTNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root: BTNode = { value: values[0]!, left: null, right: null };
  const queue: BTNode[] = [root];
  let i = 1;
  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length) {
      const lv = values[i]!;
      if (lv !== null) {
        node.left = { value: lv, left: null, right: null };
        queue.push(node.left);
      }
      i++;
    }
    if (i < values.length) {
      const rv = values[i]!;
      if (rv !== null) {
        node.right = { value: rv, left: null, right: null };
        queue.push(node.right);
      }
      i++;
    }
  }
  return root;
}
