// =============================================================================
// 单调队列 Monotonic Queue · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典应用：滑动窗口最大值（Sliding Window Maximum）。
// 维护一个**单调递减**的双端队列（存下标，对应值从队首到队尾递减）：
//   队首始终是当前窗口的最大值的下标。
// =============================================================================

/** 单调队列执行过程中的事件钩子。任一可选。 */
export interface MonotonicQueueHooks {
  /** 比较：当前下标 i 与队尾下标 tailIdx（比较两者的值）。 */
  onCompare?: (i: number, tailIdx: number) => void;
  /** 队尾弹出（被当前更大的元素淘汰）。 */
  onPopBack?: (tailIdx: number, currentValue: number) => void;
  /** 当前下标 i 入队尾。 */
  onPushBack?: (i: number) => void;
  /** 队首过期（已滑出窗口）被移除。 */
  onPopFront?: (frontIdx: number) => void;
  /** 一个窗口 [lo, hi] 的最大值已确定为 nums[front]。 */
  onWindowMax?: (lo: number, hi: number, maxIdx: number) => void;
}

/**
 * 单调队列：滑动窗口最大值。
 * @param nums 输入数组
 * @param k 窗口大小（1 ≤ k ≤ n）
 * @param hooks 可选事件钩子
 * @returns 每个窗口的最大值数组（长度 n - k + 1）。k > n 时返回空数组。
 */
export function slidingWindowMax(
  nums: readonly number[],
  k: number,
  hooks: MonotonicQueueHooks = {},
): number[] {
  const n = nums.length;
  if (k <= 0 || k > n) return [];
  const deque: number[] = []; // 存下标，对应值单调递减（队首最大）
  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // 1. 入队：弹出队尾所有「值 ≤ nums[i]」的下标，保持单调递减
    while (deque.length > 0) {
      const tail = deque[deque.length - 1]!;
      hooks.onCompare?.(i, tail);
      if (nums[tail]! <= nums[i]!) {
        deque.pop();
        hooks.onPopBack?.(tail, nums[i]!);
      } else {
        break;
      }
    }
    deque.push(i);
    hooks.onPushBack?.(i);

    // 2. 队首过期：若队首下标滑出窗口 [i-k+1, i]，移除
    const lo = i - k + 1;
    if (deque[0]! < lo) {
      const front = deque.shift()!;
      hooks.onPopFront?.(front);
    }

    // 3. 窗口已满（i >= k-1）时记录最大值
    if (i >= k - 1) {
      const front = deque[0]!;
      result.push(nums[front]!);
      hooks.onWindowMax?.(lo, i, front);
    }
  }
  return result;
}

/**
 * 兼容默认导出名：滑动窗口最大值，窗口大小默认 3。
 */
export function monotonicQueue(nums: readonly number[], hooks: MonotonicQueueHooks = {}): number[] {
  return slidingWindowMax(nums, Math.min(3, nums.length || 1), hooks);
}
