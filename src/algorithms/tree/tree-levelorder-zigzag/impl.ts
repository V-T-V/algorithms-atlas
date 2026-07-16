// =============================================================================
// 锯齿层序遍历（双栈）· 纯算法实现
// =============================================================================

/** 二叉树节点。 */
export interface BTNode {
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ZigzagStackHooks {
  /** 进入新的一层，dir = 'ltr' | 'rtl'。 */
  onLevel?: (level: number, dir: 'ltr' | 'rtl') => void;
  /** 访问一个节点。 */
  onVisit?: (value: number, level: number) => void;
}

/**
 * 锯齿层序遍历（双栈版）。
 *
 * @param root 树根
 * @param hooks 可选的事件钩子
 * @returns 展平的锯齿访问序列
 */
export function zigzagLevelOrder(root: BTNode | null, hooks: ZigzagStackHooks = {}): number[] {
  if (!root) return [];
  const out: number[] = [];
  let currentStack: BTNode[] = [root];
  let nextStack: BTNode[] = [];
  let level = 0;
  while (currentStack.length > 0) {
    const dir: 'ltr' | 'rtl' = level % 2 === 0 ? 'ltr' : 'rtl';
    hooks.onLevel?.(level, dir);
    while (currentStack.length > 0) {
      const n = currentStack.pop()!;
      out.push(n.value);
      hooks.onVisit?.(n.value, level);
      if (dir === 'ltr') {
        // 偶数层从左到右：先压左后压右（保证下次弹出时先右后左 = rtl）
        if (n.left) nextStack.push(n.left);
        if (n.right) nextStack.push(n.right);
      } else {
        // 奇数层从右到左：先压右后压左
        if (n.right) nextStack.push(n.right);
        if (n.left) nextStack.push(n.left);
      }
    }
    // 交换栈
    const tmp = currentStack;
    currentStack = nextStack;
    nextStack = tmp;
    level++;
  }
  return out;
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
