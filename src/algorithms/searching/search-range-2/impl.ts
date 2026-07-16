// 查找区间 · 纯算法实现
export interface Range2Hooks {
  onFind?: (which: 'first' | 'last', idx: number) => void;
}

export function searchRange2(
  arr: readonly number[],
  target: number,
  hooks: Range2Hooks = {},
): [number, number] {
  const findFirst = (): number => {
    let lo = 0,
      hi = arr.length - 1,
      ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid]! === target) {
        ans = mid;
        hi = mid - 1;
      } else if (arr[mid]! < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };
  const findLast = (): number => {
    let lo = 0,
      hi = arr.length - 1,
      ans = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid]! === target) {
        ans = mid;
        lo = mid + 1;
      } else if (arr[mid]! < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return ans;
  };
  const first = findFirst();
  hooks.onFind?.('first', first);
  if (first === -1) return [-1, -1];
  const last = findLast();
  hooks.onFind?.('last', last);
  return [first, last];
}
