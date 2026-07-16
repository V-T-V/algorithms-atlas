// 奇偶归并排序（Batcher）· 纯算法实现
export interface OddEvenMergeHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

function oddevenMerge(
  a: number[],
  lo: number,
  n: number,
  r: number,
  hooks: OddEvenMergeHooks,
): void {
  const step = r * 2;
  if (step < n) {
    oddevenMerge(a, lo, n, step, hooks);
    oddevenMerge(a, lo + r, n, step, hooks);
    for (let i = lo + r; i + r < lo + n; i += step) {
      hooks.onCompare?.(i, i + r, a);
      if (a[i]! > a[i + r]!) [a[i], a[i + r]] = [a[i + r]!, a[i]!];
    }
  } else {
    hooks.onCompare?.(lo + r - r, lo + r, a);
    if (a[lo]! > a[lo + r]!) [a[lo], a[lo + r]] = [a[lo + r]!, a[lo]!];
  }
}

function oddevenSort(a: number[], lo: number, n: number, hooks: OddEvenMergeHooks): void {
  if (n > 1) {
    const m = n / 2;
    oddevenSort(a, lo, m, hooks);
    oddevenSort(a, lo + m, m, hooks);
    oddevenMerge(a, lo, n, 1, hooks);
  }
}

export function oddEvenMergeSort(arr: readonly number[], hooks: OddEvenMergeHooks = {}): number[] {
  const a = [...arr];
  let n = 1;
  while (n < a.length) n *= 2;
  while (a.length < n) a.push(Number.MAX_SAFE_INTEGER);
  oddevenSort(a, 0, n, hooks);
  return a.filter((v) => v !== Number.MAX_SAFE_INTEGER);
}
