// 摆动序列 · 实现
export interface WiggleHooks {
  onTurn?: (i: number, dir: 1 | -1) => void;
  onConclude?: (length: number) => void;
}
export interface WiggleResult {
  length: number;
}
export function greedyWiggle2(nums: readonly number[], hooks: WiggleHooks = {}): WiggleResult {
  if (nums.length < 2) return { length: nums.length };
  let prevDiff = 0;
  let length = 1;
  for (let i = 1; i < nums.length; i++) {
    const diff = nums[i]! - nums[i - 1]!;
    if ((diff > 0 && prevDiff <= 0) || (diff < 0 && prevDiff >= 0)) {
      length++;
      prevDiff = diff;
      hooks.onTurn?.(i, diff > 0 ? 1 : -1);
    }
  }
  hooks.onConclude?.(length);
  return { length };
}
