// =============================================================================
// 恢复 BST（Recover BST）· 纯算法实现（零 DOM 依赖，可独立单测）
// 一棵 BST 中恰好有两个节点被交换，找出它们并恢复。
// 经典做法：中序遍历应当严格递增；找出"逆序对"定位两个被交换的节点。
// =============================================================================

/** BST 节点。 */
export interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

/** 执行过程中的事件钩子（全可选）。 */
export interface RecoverHooks {
  /** 中序遍历访问到一个节点。 */
  onVisit?: (value: number) => void;
  /** 检测到一个逆序对（prev > curr）。 */
  onAnomaly?: (prev: number, curr: number, index: number) => void;
  /** 完成交换修复，给出被交换的两个值。 */
  onSwap?: (a: number, b: number) => void;
}

/** 恢复结果。 */
export interface RecoverResult {
  /** 被交换的两个值（损坏树中的取值，恢复前）。 */
  swapped: [number, number];
  /** 恢复后的中序序列（应当严格递增）。 */
  inorder: number[];
}

/**
 * 恢复 BST：一棵 BST 中恰好有两个节点被交换，找出并修复。
 *
 * 原理：BST 的中序遍历是**严格递增**序列。若有两个节点 a、b 被交换，
 * 中序序列中会出现"逆序对"（前一个 > 后一个）：
 *
 * - 相邻交换：只出现 1 个逆序对，两个端点就是被交换的节点
 * - 非相邻交换：出现 2 个逆序对，第一个逆序对的"较大端"和第二个逆序对的"较小端"
 *   才是真正被交换的两个节点
 *
 * 统一记法：维护 `first` 与 `second`。遇到逆序对时：
 * - 若 `first` 还未确定，记 first = seq[i-1]（较大者），second = seq[i]（先暂记较小者）
 * - 之后若再遇到逆序对，更新 second = seq[i]（新的较小者）
 * 最后交换 first 与 second 的值即可。
 *
 * **复杂度**：时间 O(n)，空间 O(h)（递归栈；若用 Morris 遍历可做到 O(1)）。
 *
 * @param root 被破坏的 BST 根节点（会被原地修复）
 * @param hooks 可选事件钩子
 * @returns 恢复结果（被交换的两值 + 恢复后的中序序列）
 */
export function bstRecover(root: BSTNode | null, hooks: RecoverHooks = {}): RecoverResult {
  // 第一遍：中序遍历，记录节点引用与值，同时回调 onVisit / onAnomaly
  const nodes: BSTNode[] = [];
  const values: number[] = [];
  const walk = (n: BSTNode | null): void => {
    if (!n) return;
    walk(n.left);
    nodes.push(n);
    values.push(n.value);
    hooks.onVisit?.(n.value);
    walk(n.right);
  };
  walk(root);

  // 第二遍：在值序列上找逆序对，定位 first / second
  let first: BSTNode | null = null;
  let second: BSTNode | null = null;
  for (let i = 1; i < nodes.length; i++) {
    if (values[i - 1]! > values[i]!) {
      hooks.onAnomaly?.(values[i - 1]!, values[i]!, i);
      if (!first) {
        first = nodes[i - 1] ?? null;
        second = nodes[i] ?? null;
      } else {
        second = nodes[i] ?? null;
      }
    }
  }

  const swapped: [number, number] = [first ? first.value : NaN, second ? second.value : NaN];

  // 第三步：交换两个节点的值，原地修复
  if (first && second) {
    const tmp = first.value;
    first.value = second.value;
    second.value = tmp;
    hooks.onSwap?.(swapped[0], swapped[1]);
  }

  // 恢复后的中序（重新计算，应严格递增）
  const inorder: number[] = [];
  const recollect = (n: BSTNode | null): void => {
    if (!n) return;
    recollect(n.left);
    inorder.push(n.value);
    recollect(n.right);
  };
  recollect(root);

  return { swapped, inorder };
}

// ---------------------------------------------------------------------------
// 辅助构造函数（便于测试与演示）
// ---------------------------------------------------------------------------

/** 层序构建二叉树（null 表示空位）。 */
export function buildTree(values: Array<number | null>): BSTNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root: BSTNode = { value: values[0]!, left: null, right: null };
  const queue: BSTNode[] = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift()!;
    if (i < values.length) {
      const lv = values[i++] ?? null;
      if (lv !== null) {
        node.left = { value: lv, left: null, right: null };
        queue.push(node.left!);
      }
    }
    if (i < values.length) {
      const rv = values[i++] ?? null;
      if (rv !== null) {
        node.right = { value: rv, left: null, right: null };
        queue.push(node.right!);
      }
    }
  }
  return root;
}

/** 把节点值为 a 和 b 的两个节点的值交换（用于人为制造"被破坏的 BST"）。 */
export function swapValues(root: BSTNode | null, a: number, b: number): void {
  if (!root) return;
  const find = (n: BSTNode | null): Array<BSTNode> => {
    if (!n) return [];
    const hits = n.value === a || n.value === b ? [n] : [];
    return [...hits, ...find(n.left), ...find(n.right)];
  };
  const [na, nb] = find(root);
  if (na && nb) {
    const tmp = na.value;
    na.value = nb.value;
    nb.value = tmp;
  }
}
