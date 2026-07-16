// =============================================================================
// 主元素 / 多数元素（Boyer-Moore 投票）· 纯算法实现
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface MajorityHooks {
  /** candidate 变更为 val（当 count 归零后选出新候选）。 */
  onCandidateChange?: (val: number) => void;
  /** 访问元素 val，给出当前 count 值（访问后）。 */
  onCount?: (val: number, count: number) => void;
  /** 投票阶段结束，给出最终 candidate。 */
  onDone?: (candidate: number) => void;
}

/**
 * Boyer-Moore 投票法：返回数组中出现次数超过 n/2 的主元素。
 * 假设输入存在主元素（否则返回的是「最可能」的候选，需外部验证）。
 *
 * @param arr 输入数组（非空）
 * @param hooks 可选事件钩子
 * @returns 主元素值
 */
export function majorityElement(arr: readonly number[], hooks: MajorityHooks = {}): number {
  if (arr.length === 0) throw new RangeError('arr 不能为空');

  let candidate = arr[0]!;
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    const x = arr[i]!;
    if (count === 0) {
      candidate = x;
      count = 1;
      hooks.onCandidateChange?.(candidate);
    } else if (x === candidate) {
      count++;
    } else {
      count--;
    }
    hooks.onCount?.(x, count);
  }

  hooks.onDone?.(candidate);
  return candidate;
}

/**
 * 判定主元素是否存在（投票 + 第二遍计数验证）。
 * @returns 主元素值，若不存在返回 null。
 */
export function findMajority(arr: readonly number[], hooks: MajorityHooks = {}): number | null {
  if (arr.length === 0) return null;
  const candidate = majorityElement(arr, hooks);
  let freq = 0;
  for (const x of arr) if (x === candidate) freq++;
  return freq > arr.length / 2 ? candidate : null;
}
