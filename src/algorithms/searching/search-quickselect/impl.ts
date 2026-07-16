// 快速选择（第 k 小）· 纯算法实现
export interface QuickselectHooks {
  onPartition?: (pivotIdx: number, arr: number[]) => void;
}

export function quickselect(
  arr: readonly number[],
  k: number,
  hooks: QuickselectHooks = {},
): number {
  if (k < 1 || k > arr.length) throw new RangeError('k 超出范围');
  const a = [...arr];
  let lo = 0,
    hi = a.length - 1,
    target = k - 1;
  while (lo < hi) {
    const pivot = a[hi]!;
    let i = lo;
    for (let j = lo; j < hi; j++)
      if (a[j]! <= pivot) {
        [a[i]!, a[j]!] = [a[j]!, a[i]!];
        i++;
      }
    [a[i]!, a[hi]!] = [a[hi]!, a[i]!];
    hooks.onPartition?.(i, a);
    if (i === target) return a[i]!;
    if (i < target) lo = i + 1;
    else hi = i - 1;
  }
  return a[lo]!;
}
