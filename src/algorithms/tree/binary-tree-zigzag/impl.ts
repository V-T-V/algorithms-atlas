// =============================================================================
// 二叉树锯齿形遍历（Zigzag / Spiral Traversal）· 纯算法实现（零 DOM 依赖，可独立单测）
// 第 0 层从左到右，第 1 层从右到左，第 2 层从左到右……交替进行。
// =============================================================================

/** 二叉树节点（纯数据，无父指针）。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ZigzagHooks {
  /** 访问一个节点（输出它），给出它所在的层（0-based）。 */
  onVisit?: (value: number, level: number) => void;
}

/**
 * 锯齿形层序遍历：奇偶层交替方向。
 *
 * 第 0 层从左到右、第 1 层从右到左、第 2 层又从左到右……如此蛇形前进。
 *
 * 实现：标准层序 BFS 取出每一层，**偶数层原序、奇数层反转**后追加到结果。
 *
 * 直观理解：像「之」字形 / 蛇形扫描。常用于：
 * - 二维矩阵的蛇形打印
 * - 之字形层序输出（面试经典题）
 *
 * 等价的纯 BFS 双栈写法：用两个栈交替（左栈弹出后按「先左后右」压右栈、右栈弹出后按「先右后左」压左栈），
 * 本实现用「分组层序 + 反转」更直观。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 展平的锯齿访问序列
 */
export function binaryTreeZigzag(root: BTNode | null, hooks: ZigzagHooks = {}): number[] {
  return binaryTreeZigzagGrouped(root, hooks).flat();
}

/** 锯齿形层序遍历（逐层分组版）：返回每层（已按方向排好序）的节点值数组。 */
export function binaryTreeZigzagGrouped(root: BTNode | null, hooks: ZigzagHooks = {}): number[][] {
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
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    if (level % 2 === 1) row.reverse(); // 奇数层从右到左
    // 注意：hooks 按最终（已反转）顺序触发
    for (const v of row) hooks.onVisit?.(v, level);
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
