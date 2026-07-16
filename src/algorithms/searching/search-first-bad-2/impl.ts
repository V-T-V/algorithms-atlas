// 查找首个坏版本 · 纯算法实现
export interface FirstBad2Hooks {
  onCheck?: (mid: number) => void;
}

export function firstBadVersion2(
  n: number,
  isBad: (v: number) => boolean,
  hooks: FirstBad2Hooks = {},
): number {
  let lo = 1,
    hi = n,
    ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCheck?.(mid);
    if (isBad(mid)) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}
