// =============================================================================
// 打家劫舍（环形）· 纯算法实现
// =============================================================================
export interface RobHooks {
  onHouse?: (i: number, robVal: number, skipVal: number) => void;
  onRange?: (lo: number, hi: number) => void;
  onDone?: (best: number) => void;
}

function robLine(nums: readonly number[], lo: number, hi: number, hooks: RobHooks): number {
  let prev2 = 0,
    prev1 = 0;
  for (let i = lo; i <= hi; i++) {
    const cur = Math.max(prev1, prev2 + nums[i]!);
    hooks.onHouse?.(i, prev2 + nums[i]!, prev1);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

export function robberCircular(nums: readonly number[], hooks: RobHooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  if (n === 1) {
    hooks.onDone?.(nums[0]!);
    return nums[0]!;
  }
  hooks.onRange?.(0, n - 2);
  const a = robLine(nums, 0, n - 2, hooks);
  hooks.onRange?.(1, n - 1);
  const b = robLine(nums, 1, n - 1, hooks);
  const ans = Math.max(a, b);
  hooks.onDone?.(ans);
  return ans;
}
