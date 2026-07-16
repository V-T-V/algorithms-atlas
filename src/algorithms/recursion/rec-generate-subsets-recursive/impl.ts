// 递归生成子集（扩展法）· 实现

export interface SubsetHooks {
  onSubset?: (subset: number[]) => void;
  onPick?: (index: number, value: number) => void;
}

/** 扩展法递归生成所有子集（含空集），按字典序。 */
export function generateSubsetsRecursive(nums: number[], hooks: SubsetHooks = {}): number[][] {
  const result: number[][] = [];
  const cur: number[] = [];

  const dfs = (start: number): void => {
    result.push([...cur]);
    hooks.onSubset?.([...cur]);
    for (let i = start; i < nums.length; i++) {
      cur.push(nums[i]!);
      hooks.onPick?.(i, nums[i]!);
      dfs(i + 1);
      cur.pop();
    }
  };

  dfs(0);
  return result;
}

/** 含重复元素时的去重版本（需先排序）。 */
export function generateSubsetsUnique(nums: number[], hooks: SubsetHooks = {}): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const result: number[][] = [];
  const cur: number[] = [];
  const dfs = (start: number): void => {
    result.push([...cur]);
    hooks.onSubset?.([...cur]);
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      cur.push(sorted[i]!);
      dfs(i + 1);
      cur.pop();
    }
  };
  dfs(0);
  return result;
}
