// 快速排序（三数取中）· 纯算法实现
export interface QuickMedian3Hooks {
  onPartition?: (lo: number, hi: number, pivot: number, arr: number[]) => void;
}

function med3(a: number[], x: number, y: number, z: number): number {
  const bx = a[x]!,
    by = a[y]!,
    bz = a[z]!;
  if ((bx <= by && by <= bz) || (bz <= by && by <= bx)) return y;
  if ((by <= bx && bx <= bz) || (bz <= bx && bx <= by)) return x;
  return z;
}

export function quickSortMedian3(arr: readonly number[], hooks: QuickMedian3Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  const stack: Array<[number, number]> = [[0, n - 1]];
  while (stack.length > 0) {
    const [lo, hi] = stack.pop()!;
    if (lo >= hi) continue;
    const m = med3(a, lo, (lo + hi) >>> 1, hi);
    [a[lo], a[m]] = [a[m]!, a[lo]!];
    const pivot = a[lo]!;
    let i = lo + 1,
      j = hi;
    while (i <= j) {
      while (i <= j && a[i]! < pivot) i++;
      while (i <= j && a[j]! > pivot) j--;
      if (i <= j) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        i++;
        j--;
      }
    }
    [a[lo], a[j]] = [a[j]!, a[lo]!];
    hooks.onPartition?.(lo, hi, pivot, a);
    stack.push([lo, j - 1]);
    stack.push([i, hi]);
  }
  return a;
}
