// =============================================================================
// 单调栈（Monotonic Stack）· 纯算法实现
// 零 DOM 依赖，可独立单测。O(n) 求每个元素左/右第一个更小的下标。
// 通过「钩子」暴露 push/pop，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MonotonicStackHooks {
  /** 下标 idx 入栈。给出当前栈内容（下标）。 */
  onPush?: (idx: number, stack: number[]) => void;
  /** 下标 idx 出栈，其「右侧第一个更小」为 rightIdx（可能为 n 表示无）。 */
  onPop?: (idx: number, rightIdx: number, stack: number[]) => void;
}

/** 单调栈结果：每个元素的左/右第一个更小的下标。 */
export interface MonotonicStackResult {
  /** left[i] = a[i] 左侧第一个更小的下标，无则 -1。 */
  left: number[];
  /** right[i] = a[i] 右侧第一个更小的下标，无则 n。 */
  right: number[];
}

/**
 * 单调栈：求每个元素左/右第一个**更小**的下标（严格更小，相等不算）。
 *
 * 用「单调递增栈」（存下标，对应值严格递增），正向扫描求 right：
 * - 扫描到 a[i]，弹栈直到栈空或栈顶值 < a[i]（弹出所有 >= a[i] 的）。
 *   - 每个被弹出的下标 j：right[j] = i（a[i] 是 a[j] 右侧第一个更小，因为栈之前严格递增，
 *     若 a[i] 与 a[j] 相等则 a[i] 不会让 j 弹出——这里用 >= 弹出，相等也弹，
 *     但相等时 a[i] 不是「严格更小」；为此只在 arr[i] < arr[j] 时记录 right[j]）。
 *
 * 为保证严格语义且保持 O(n)，采用**两次扫描**：
 * - 正向（求 right）：弹栈条件 arr[top] > arr[i]（严格大于才弹，相等保留）。
 *   弹出时 right[j] = i。相等元素保留在栈中，因其右侧更小者要由后续更小的元素触发。
 * - 逆向（求 left）：弹栈条件 arr[top] > arr[i]，对称求左侧。
 *
 * 每个元素至多入栈、出栈各一次，总时间 O(n)。
 *
 * @param arr 输入数组
 * @param hooks 可选事件钩子（仅正向扫描触发，便于录制）
 * @returns left[]、right[]
 */
export function monotonicStack(
  arr: readonly number[],
  hooks: MonotonicStackHooks = {},
): MonotonicStackResult {
  const n = arr.length;
  const left: number[] = new Array(n).fill(-1);
  const right: number[] = new Array(n).fill(n);

  // 正向扫描求 right（右侧第一个更小）：栈存下标，值严格递增
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    const vi = arr[i]!;
    // 弹出所有值严格大于 vi 的栈顶（它们右侧第一个更小 = i）
    while (stack.length > 0 && arr[stack[stack.length - 1]!]! > vi) {
      const j = stack.pop()!;
      right[j] = i;
      hooks.onPop?.(j, i, [...stack]);
    }
    stack.push(i);
    hooks.onPush?.(i, [...stack]);
  }

  // 逆向扫描求 left（左侧第一个更小）：栈存下标，值严格递增（从右向左看）
  const stack2: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const vi = arr[i]!;
    while (stack2.length > 0 && arr[stack2[stack2.length - 1]!]! > vi) {
      const j = stack2.pop()!;
      left[j] = i;
    }
    stack2.push(i);
  }

  return { left, right };
}

/**
 * 求「左/右第一个更大」的下标：对负数组复用 smaller 逻辑。
 * 返回的 left/right 仍是针对原数组的「更大」语义（因取负后更大 ↔ 原数组更小）。
 */
export function monotonicStackGreater(
  arr: readonly number[],
  hooks: MonotonicStackHooks = {},
): MonotonicStackResult {
  const neg = arr.map((v) => -v);
  return monotonicStack(neg, hooks);
}
