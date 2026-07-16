// 多数元素（投票法）· 纯算法实现
export interface MajorityHooks {
  onVote?: (i: number, candidate: number, count: number) => void;
}

export function majorityElement(arr: readonly number[], hooks: MajorityHooks = {}): number {
  let candidate = 0,
    count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (count === 0) candidate = arr[i]!;
    count += arr[i]! === candidate ? 1 : -1;
    hooks.onVote?.(i, candidate, count);
  }
  return candidate;
}
