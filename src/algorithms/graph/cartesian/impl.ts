// =============================================================================
// 笛卡尔树（Cartesian Tree）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 由数组 A 构造笛卡尔树：堆性质（小根，父 ≤ 子）+ 中序遍历还原原数组。
// 单调栈 O(n)：维护最右链，遇到更小元素则弹出至满足堆性质。
// =============================================================================

/** 执行过程中的事件钩子。任一可选。 */
export interface CartesianHooks {
  /** 处理下标 i：当前最右链栈状态 stack（从底到顶）。 */
  onStep?: (i: number, stack: number[]) => void;
  /** 弹出栈顶 j（将成为新节点 i 的左子）。 */
  onPop?: (j: number, i: number) => void;
  /** 连接：parent 的孩子 slot 设为 child。slot: 'left' | 'right'。 */
  onLink?: (parent: number, child: number, slot: 'left' | 'right') => void;
  /** 全树构建完成，根为 root。 */
  onRoot?: (root: number) => void;
}

export interface CartesianResult {
  /** 根节点下标（数组中最小值的下标），数组为空时为 -1。 */
  root: number;
  /** parent[i] = i 的父节点下标，根为 -1。 */
  parent: number[];
  /** left[i] = i 的左孩子下标，无则 -1。 */
  left: number[];
  /** right[i] = i 的右孩子下标，无则 -1。 */
  right: number[];
}

/**
 * 由数组构造（小根堆）笛卡尔树。
 *
 * @param values 输入数组
 * @param hooks 可选事件钩子
 * @returns 根、parent/left/right 数组
 */
export function cartesian(values: number[], hooks: CartesianHooks = {}): CartesianResult {
  const n = values.length;
  const parent = new Array<number>(n).fill(-1);
  const left = new Array<number>(n).fill(-1);
  const right = new Array<number>(n).fill(-1);

  if (n === 0) return { root: -1, parent, left, right };

  const stack: number[] = []; // 最右链（下标），栈底到栈顶值递增

  for (let i = 0; i < n; i++) {
    let last = -1;
    while (stack.length > 0) {
      const topIdx = stack[stack.length - 1]!;
      if (values[topIdx]! <= values[i]!) break;
      last = stack.pop()!;
      hooks.onPop?.(last, i);
    }
    if (last !== -1) {
      left[i] = last;
      parent[last] = i;
      hooks.onLink?.(i, last, 'left');
    }
    if (stack.length > 0) {
      const top = stack[stack.length - 1]!;
      right[top] = i;
      parent[i] = top;
      hooks.onLink?.(top, i, 'right');
    }
    stack.push(i);
    hooks.onStep?.(i, [...stack]);
  }

  const root = stack[0] ?? 0;
  hooks.onRoot?.(root);
  return { root, parent, left, right };
}
