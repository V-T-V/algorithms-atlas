// =============================================================================
// 单调栈 Monotonic Stack · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典应用：下一个更大元素（Next Greater Element）。
// 维护一个**单调递减**的栈（存下标），从左到右扫描数组：
//   对每个 i，弹出栈顶所有「值小于 nums[i]」的下标，这些下标的「下一个更大」即 nums[i]。
// =============================================================================

/** 单调栈执行过程中的事件钩子。任一可选。 */
export interface MonotonicStackHooks {
  /** 比较：当前下标 i 与栈顶下标 topIdx（比较两者的值）。 */
  onCompare?: (i: number, topIdx: number) => void;
  /** 栈顶弹出：被弹出的下标 topIdx 的「下一个更大」= 当前元素。 */
  onPop?: (topIdx: number, currentValue: number) => void;
  /** 当前下标 i 压入栈。 */
  onPush?: (i: number) => void;
}

/**
 * 单调栈：求每个元素右侧第一个更大的元素（Next Greater Element）。
 * @param nums 输入数组
 * @param hooks 可选事件钩子
 * @returns result：result[i] = nums[i] 右侧第一个更大元素的「值」；不存在则为 -1。
 *          同时返回索引版 resultIdx（不存在为 -1）。
 */
export function nextGreaterElements(
  nums: readonly number[],
  hooks: MonotonicStackHooks = {},
): { values: number[]; indices: number[] } {
  const n = nums.length;
  const resultIdx: number[] = new Array(n).fill(-1);
  const stack: number[] = []; // 存下标，对应值单调递减（栈底最大）

  for (let i = 0; i < n; i++) {
    while (stack.length > 0) {
      const top = stack[stack.length - 1]!;
      hooks.onCompare?.(i, top);
      if (nums[top]! < nums[i]!) {
        // 栈顶遇到「下一个更大」→ 弹出并记录
        stack.pop();
        resultIdx[top] = i;
        hooks.onPop?.(top, nums[i]!);
      } else {
        break;
      }
    }
    stack.push(i);
    hooks.onPush?.(i);
  }

  // 剩余栈中元素没有「下一个更大」：resultIdx 已为 -1，无需处理
  const values = resultIdx.map((idx) => (idx === -1 ? -1 : nums[idx]!));
  return { values, indices: resultIdx };
}

/**
 * 兼容默认导出名：返回「下一个更大元素值」数组（不存在为 -1）。
 */
export function monotonicStack(nums: readonly number[], hooks: MonotonicStackHooks = {}): number[] {
  return nextGreaterElements(nums, hooks).values;
}
