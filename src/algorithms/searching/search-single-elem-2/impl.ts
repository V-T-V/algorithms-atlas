// 查找单一元素 · 纯算法实现
export interface SingleElem2Hooks {
  onCompare?: (mid: number) => void;
}

export function singleNonDuplicate2(arr: readonly number[], hooks: SingleElem2Hooks = {}): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo < hi) {
    let mid = (lo + hi) >>> 1;
    if (mid % 2 === 1) mid--;
    hooks.onCompare?.(mid);
    if (arr[mid]! === arr[mid + 1]!) lo = mid + 2;
    else hi = mid;
  }
  return arr[lo]!;
}
