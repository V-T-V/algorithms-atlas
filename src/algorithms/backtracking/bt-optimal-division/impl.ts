// =============================================================================
// 最优除法 · 纯算法实现 (LeetCode 553)
// 对 nums[0]/nums[1]/.../nums[n-1]，最大值为 nums[0]/(nums[1]/.../nums[n-1])。
// =============================================================================
export interface BtOptimalDivisionHooks {
  onCombine?: (expr: string, value: number) => void;
  onResult?: (expr: string) => void;
}

export function btOptimalDivision(
  nums: readonly number[],
  hooks: BtOptimalDivisionHooks = {},
): string {
  if (nums.length <= 1) {
    const out = String(nums[0] ?? '');
    hooks.onResult?.(out);
    return out;
  }
  if (nums.length === 2) {
    const out = `${nums[0]}/${nums[1]}`;
    hooks.onResult?.(out);
    return out;
  }
  // a/(b/c/d/...)
  const first = nums[0]!;
  const rest = nums.slice(1).join('/');
  const out = `${first}/(${rest})`;
  hooks.onCombine?.(out, first / nums.slice(1).reduce((acc, v) => acc / v));
  hooks.onResult?.(out);
  return out;
}
