// =============================================================================
// 双指针（Two Pointers）· 纯算法实现
// 经典应用：有序数组两数之和（对撞双指针）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露指针移动。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface TwoPointerHooks {
  /** 双指针比较当前位置 left、right 之和与目标。 */
  onCompare?: (left: number, right: number, sum: number) => void;
  /** 左指针移动到新位置。 */
  onMoveLeft?: (left: number) => void;
  /** 右指针移动到新位置。 */
  onMoveRight?: (right: number) => void;
  /** 找到一对解（left, right）。 */
  onFound?: (left: number, right: number) => void;
}

export interface TwoSumResult {
  /** 解的下标对；无解时为 null。 */
  pair: [number, number] | null;
  /** 所有合法下标对（若有多解）。 */
  allPairs: Array<[number, number]>;
}

/**
 * 有序数组两数之和（对撞双指针）。
 * 数组必须**已升序**。返回和等于 target 的下标对。
 *
 * 策略：left 从 0 出发，right 从末尾出发：
 *  - 若 a[left]+a[right] === target → 记录解，left++、right--（找下一对）
 *  - 若和 < target → left++（需要更大）
 *  - 若和 > target → right--（需要更小）
 *
 * 时间 O(n)，空间 O(1)。
 *
 * @param arr 升序数组
 * @param target 目标和
 * @param hooks 可选事件钩子
 */
export function twoSumSorted(
  arr: readonly number[],
  target: number,
  hooks: TwoPointerHooks = {},
): TwoSumResult {
  const allPairs: Array<[number, number]> = [];
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left]! + arr[right]!;
    hooks.onCompare?.(left, right, sum);
    if (sum === target) {
      allPairs.push([left, right]);
      hooks.onFound?.(left, right);
      left++;
      right--;
      hooks.onMoveLeft?.(left);
      hooks.onMoveRight?.(right);
    } else if (sum < target) {
      left++;
      hooks.onMoveLeft?.(left);
    } else {
      right--;
      hooks.onMoveRight?.(right);
    }
  }
  return { pair: allPairs.length > 0 ? allPairs[0]! : null, allPairs };
}

/** 旧占位名保留兼容（直接转调）。 */
export const twoPointer = twoSumSorted;
