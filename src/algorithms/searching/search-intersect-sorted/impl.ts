// 有序数组交集 · 纯算法实现
export interface IntersectHooks {
  onCompare?: (i: number, j: number) => void;
}

export function intersectSorted(
  a: readonly number[],
  b: readonly number[],
  hooks: IntersectHooks = {},
): number[] {
  const out: number[] = [];
  let i = 0,
    j = 0;
  while (i < a.length && j < b.length) {
    hooks.onCompare?.(i, j);
    if (a[i]! === b[j]!) {
      if (out.length === 0 || out[out.length - 1]! !== a[i]!) out.push(a[i]!);
      i++;
      j++;
    } else if (a[i]! < b[j]!) i++;
    else j++;
  }
  return out;
}
