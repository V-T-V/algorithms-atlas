// =============================================================================
// LIS 计数（方案数）· 纯算法实现
// len[i] = 以 nums[i] 结尾的 LIS 长度；cnt[i] = 对应方案数。
// =============================================================================

export interface LisCountHooks {
  onInit?: (n: number) => void;
  onCompare?: (i: number, j: number) => void;
  onUpdate?: (i: number, len: number, cnt: number) => void;
  onDone?: (maxLen: number, total: number) => void;
}

export interface LisCountResult {
  maxLen: number;
  count: number;
}

export function lisCount(nums: readonly number[], hooks: LisCountHooks = {}): LisCountResult {
  const n = nums.length;
  if (n === 0) {
    hooks.onDone?.(0, 0);
    return { maxLen: 0, count: 0 };
  }
  const len = new Array<number>(n).fill(1);
  const cnt = new Array<number>(n).fill(1);
  hooks.onInit?.(n);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      hooks.onCompare?.(i, j);
      if (nums[j]! < nums[i]!) {
        if (len[j]! + 1 > len[i]!) {
          len[i] = len[j]! + 1;
          cnt[i] = cnt[j]!;
        } else if (len[j]! + 1 === len[i]!) {
          cnt[i]! += cnt[j]!;
        }
      }
    }
    hooks.onUpdate?.(i, len[i]!, cnt[i]!);
  }

  let maxLen = 0;
  for (const v of len) if (v > maxLen) maxLen = v;
  let total = 0;
  for (let i = 0; i < n; i++) if (len[i] === maxLen) total += cnt[i]!;
  hooks.onDone?.(maxLen, total);
  return { maxLen, count: total };
}
