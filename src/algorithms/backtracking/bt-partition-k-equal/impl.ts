export interface PkHooks {
  onPlace?: (idx: number, bucket: number) => void;
  onResult?: (ok: boolean) => void;
}
export function canPartitionKSubsets(nums: number[], k: number, hooks: PkHooks = {}): boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % k !== 0) return false;
  const target = sum / k;
  const sorted = [...nums].sort((a, b) => b - a);
  if (sorted[0]! > target) return false;
  const buckets = new Array(k).fill(0);
  const go = (i: number): boolean => {
    if (i === sorted.length) return true;
    for (let b = 0; b < k; b++) {
      if (buckets[b]! + sorted[i]! > target) continue;
      if (b > 0 && buckets[b] === buckets[b - 1]) continue;
      buckets[b] += sorted[i]!;
      hooks.onPlace?.(i, b);
      if (go(i + 1)) return true;
      buckets[b] -= sorted[i]!;
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}
