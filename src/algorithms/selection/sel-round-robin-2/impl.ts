// 循环赛选择 v2 · 实现
export interface RrHooks {
  onCompare?: (i: number, j: number, winner: number) => void;
  onResult?: (v: number) => void;
}
export function roundRobinSelect(arr: number[], k: number, hooks: RrHooks = {}): number {
  const n = arr.length;
  const wins = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      // 小者获胜（找第 k 小）
      if (arr[i]! < arr[j]!) {
        wins[i]++;
        hooks.onCompare?.(i, j, i);
      }
    }
  }
  // wins[i] = 比 arr[i] 大的元素个数 = rank
  // 第 k 小 → wins == k（有 n-1-k 个更大）→ rank 从小到大 wins == n-1-k? 重新算：
  // wins[i] = j 中 arr[i] < arr[j] 的个数 = 比 arr[i] 大的个数。
  // rank (0=最小) = n - 1 - wins[i]
  let result = arr[0]!;
  for (let i = 0; i < n; i++) {
    if (n - 1 - wins[i]! === k) {
      result = arr[i]!;
      break;
    }
  }
  hooks.onResult?.(result);
  return result;
}
