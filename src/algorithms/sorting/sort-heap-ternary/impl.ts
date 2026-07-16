// 堆排序（三叉带构建）· 纯算法实现
export interface HeapTernaryHooks {
  onExtract?: (k: number, arr: number[]) => void;
}

function sift3(a: number[], root: number, size: number): void {
  while (true) {
    let largest = root;
    for (let c = 1; c <= 3; c++) {
      const child = 3 * root + c;
      if (child < size && a[child]! > a[largest]!) largest = child;
    }
    if (largest === root) break;
    [a[root], a[largest]] = [a[largest]!, a[root]!];
    root = largest;
  }
}

export function heapSortTernary(arr: readonly number[], hooks: HeapTernaryHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor((n - 1) / 3); i >= 0; i--) sift3(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    hooks.onExtract?.(end, a);
    sift3(a, 0, end);
  }
  return a;
}
