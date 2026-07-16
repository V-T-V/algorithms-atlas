// 位掩码生成子集 · 实现

export interface SubsetHooks {
  onInclude?: (index: number, current: number[]) => void;
  onExclude?: (index: number) => void;
  onSubset?: (subset: number[]) => void;
}

/** 递归回溯生成所有子集。 */
export function generateSubsetsBitmask(nums: number[], hooks: SubsetHooks = {}): number[][] {
  const result: number[][] = [];
  const current: number[] = [];

  const backtrack = (index: number): void => {
    if (index === nums.length) {
      result.push([...current]);
      hooks.onSubset?.([...current]);
      return;
    }
    // 选
    current.push(nums[index]!);
    hooks.onInclude?.(index, [...current]);
    backtrack(index + 1);
    current.pop();
    // 不选
    hooks.onExclude?.(index);
    backtrack(index + 1);
  };

  backtrack(0);
  return result;
}

/** 位掩码迭代版（等价）。 */
export function generateSubsetsBitmaskIter(nums: number[]): number[][] {
  const n = nums.length;
  const result: number[][] = [];
  const total = 1 << n;
  for (let mask = 0; mask < total; mask++) {
    const sub: number[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) sub.push(nums[i]!);
    }
    result.push(sub);
  }
  return result;
}
