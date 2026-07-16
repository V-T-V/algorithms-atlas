// 除自身以外数组的乘积 · 实现

export interface ProdHooks {
  onPrefix?: (index: number, value: number) => void;
  onSuffix?: (index: number, value: number) => void;
  onAnswer?: (index: number, value: number) => void;
}

/**
 * 递归求除自身以外数组的乘积。
 * 用递归前缀/后缀积，answer[i] = prefix[i] * suffix[i]。
 */
export function productExceptSelf(nums: number[], hooks: ProdHooks = {}): number[] {
  const n = nums.length;
  const prefix = new Array<number>(n).fill(1);
  const suffix = new Array<number>(n).fill(1);
  const answer = new Array<number>(n).fill(1);

  // 递归前缀积：prefix[i] = nums[0]*...*nums[i-1]
  const fillPrefix = (i: number, acc: number): void => {
    if (i >= n) return;
    prefix[i] = acc;
    hooks.onPrefix?.(i, acc);
    fillPrefix(i + 1, acc * nums[i]!);
  };
  // 递归后缀积：suffix[i] = nums[i+1]*...*nums[n-1]
  const fillSuffix = (i: number, acc: number): void => {
    if (i < 0) return;
    suffix[i] = acc;
    hooks.onSuffix?.(i, acc);
    fillSuffix(i - 1, acc * nums[i]!);
  };
  // 递归填 answer
  const fillAnswer = (i: number): void => {
    if (i >= n) return;
    answer[i] = prefix[i]! * suffix[i]!;
    hooks.onAnswer?.(i, answer[i]!);
    fillAnswer(i + 1);
  };

  if (n > 0) {
    fillPrefix(0, 1);
    fillSuffix(n - 1, 1);
    fillAnswer(0);
  }
  return answer;
}
