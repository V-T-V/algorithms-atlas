// 跳跃游戏（能否到达）· 实现
export interface JumpReachHooks {
  onStep?: (i: number, maxReach: number) => void;
  onConclude?: (reachable: boolean) => void;
}
export interface JumpReachResult {
  reachable: boolean;
}
export function greedyJump3(nums: readonly number[], hooks: JumpReachHooks = {}): JumpReachResult {
  let maxReach = 0;
  let reachable = false;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) break;
    maxReach = Math.max(maxReach, i + nums[i]!);
    hooks.onStep?.(i, maxReach);
    if (maxReach >= nums.length - 1) {
      reachable = true;
      break;
    }
  }
  hooks.onConclude?.(reachable);
  return { reachable };
}
