// 确定性选择 v3 · 实现（median-of-medians pivot）
export interface SelHooks {
  onPivot?: (pivot: number) => void;
  onPartition?: (left: number, right: number, pIdx: number) => void;
  onRecurse?: (left: number, right: number, k: number) => void;
  onResult?: (value: number) => void;
}
function insertSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const x = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > x) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = x;
  }
  return a;
}
function medianOfMedians(arr: number[]): number {
  if (arr.length <= 5) return insertSort(arr)[Math.floor(arr.length / 2)]!;
  const meds: number[] = [];
  for (let i = 0; i < arr.length; i += 5)
    meds.push(insertSort(arr.slice(i, i + 5))[Math.floor(Math.min(5, arr.length - i) / 2)]!);
  return medianOfMedians(meds);
}
function partition(arr: number[], left: number, right: number, pivot: number): number {
  // 找到 pivot 元素下标，移到 right
  let pi = -1;
  for (let k = left; k <= right; k++)
    if (arr[k] === pivot) {
      pi = k;
      break;
    }
  if (pi < 0) pi = right;
  [arr[pi], arr[right]] = [arr[right]!, arr[pi]!];
  // 标准 Lomuto 分区
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j]! < pivot) {
      [arr[i], arr[j]] = [arr[j]!, arr[i]!];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right]!, arr[i]!];
  return i;
}
export function deterministicSelect(arr: number[], k: number, hooks: SelHooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    hooks.onRecurse?.(left, right, kk);
    if (left === right) {
      hooks.onResult?.(a[left]!);
      return a[left]!;
    }
    const sub = a.slice(left, right + 1);
    const pivot = medianOfMedians(sub);
    hooks.onPivot?.(pivot);
    const p = partition(a, left, right, pivot);
    hooks.onPartition?.(left, right, p);
    const rank = p - left;
    if (kk === rank) {
      hooks.onResult?.(a[p]!);
      return a[p]!;
    }
    if (kk < rank) return rec(left, p - 1, kk);
    return rec(p + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
