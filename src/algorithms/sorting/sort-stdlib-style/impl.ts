// =============================================================================
// 标准库风格排序（混合）· 纯算法实现
// 插入排序（小段）+ 三数取中快排 + 堆排序兜底（introsort 思想）。
// =============================================================================
export interface StdlibSortHooks {
  onStrategy?: (lo: number, hi: number, kind: 'insertion' | 'partition' | 'heapsort') => void;
  onPartition?: (lo: number, hi: number, pivotIdx: number, arr: number[]) => void;
  onFinalize?: (arr: number[]) => void;
}

const INSERTION_THRESHOLD = 16;

function insertionRange(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i <= hi; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= lo && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}

function median3(a: number[], lo: number, hi: number): number {
  const mid = (lo + hi) >> 1;
  const x = a[lo]!,
    y = a[mid]!,
    z = a[hi]!;
  if ((x <= y && y <= z) || (z <= y && y <= x)) return mid;
  if ((y <= x && x <= z) || (z <= x && x <= y)) return lo;
  return hi;
}

function siftDown(a: number[], root: number, size: number, base: number): void {
  while (true) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;
    if (l < size && a[base + l]! > a[base + largest]!) largest = l;
    if (r < size && a[base + r]! > a[base + largest]!) largest = r;
    if (largest === root) break;
    [a[base + root], a[base + largest]] = [a[base + largest]!, a[base + root]!];
    root = largest;
  }
}

function heapsortRange(a: number[], lo: number, hi: number): void {
  const size = hi - lo + 1;
  for (let i = (size >> 1) - 1; i >= 0; i--) siftDown(a, i, size, lo);
  for (let end = size - 1; end > 0; end--) {
    [a[lo], a[lo + end]] = [a[lo + end]!, a[lo]!];
    siftDown(a, 0, end, lo);
  }
}

function partition(a: number[], lo: number, hi: number, hooks: StdlibSortHooks): number {
  const pIdx = median3(a, lo, hi);
  [a[pIdx], a[hi]] = [a[hi]!, a[pIdx]!];
  const pivot = a[hi]!;
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j]! <= pivot) {
      [a[i], a[j]] = [a[j]!, a[i]!];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi]!, a[i]!];
  hooks.onPartition?.(lo, hi, i, a);
  return i;
}

function introsort(
  a: number[],
  lo: number,
  hi: number,
  depthLimit: number,
  hooks: StdlibSortHooks,
): void {
  while (lo < hi) {
    if (hi - lo + 1 <= INSERTION_THRESHOLD) {
      hooks.onStrategy?.(lo, hi, 'insertion');
      insertionRange(a, lo, hi);
      return;
    }
    if (depthLimit === 0) {
      hooks.onStrategy?.(lo, hi, 'heapsort');
      heapsortRange(a, lo, hi);
      return;
    }
    hooks.onStrategy?.(lo, hi, 'partition');
    const p = partition(a, lo, hi, hooks);
    // 尾递归优化：先排较短一侧
    introsort(a, lo, p - 1, depthLimit - 1, hooks);
    lo = p + 1;
    depthLimit--;
  }
}

export function stdlibSort(arr: readonly number[], hooks: StdlibSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;
  const depthLimit = 2 * Math.floor(Math.log2(n)) + 1;
  introsort(a, 0, n - 1, depthLimit, hooks);
  hooks.onFinalize?.(a);
  return a;
}
