// 查找缺失数字 · 纯算法实现
export interface Missing2Hooks {
  onSum?: (i: number, sum: number) => void;
}

export function missingNumber2(arr: readonly number[], hooks: Missing2Hooks = {}): number {
  const n = arr.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i]!;
    hooks.onSum?.(i, sum);
  }
  const expected = (n * (n + 1)) / 2;
  return expected - sum;
}
