// 滑动窗口中位数（简化：直接排序窗口）· 实现
// 本实现用「每窗排序」演示，复杂度 O(n*k log k)；核心逻辑清晰。

export interface MrwStep {
  index: number;
  window: number[];
  median: number;
}

/** 滑动窗口中位数。窗口从左到右，每次输出中位数。 */
export function medianSlidingWindow(nums: number[], k: number): number[] {
  if (k <= 0 || k > nums.length) throw new RangeError(`k=${k} 无效`);
  const result: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    const win = nums.slice(i, i + k).sort((a, b) => a - b);
    const med = k % 2 === 1 ? win[(k - 1) >> 1]! : (win[k / 2 - 1]! + win[k / 2]!) / 2;
    result.push(med);
  }
  return result;
}

export function medianSlidingWindowSteps(nums: number[], k: number): MrwStep[] {
  const steps: MrwStep[] = [];
  const medians = medianSlidingWindow(nums, k);
  let idx = 0;
  for (let i = 0; i + k <= nums.length; i++) {
    steps.push({ index: i, window: nums.slice(i, i + k), median: medians[idx]! });
    idx++;
  }
  return steps;
}
