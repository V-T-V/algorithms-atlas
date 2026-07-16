// median-of-3 快速选择 · 实现
export interface Q3Hooks {
  onPivot?: (pivot: number) => void;
  onResult?: (value: number) => void;
}
function med3(a: number[], l: number, m: number, r: number): number {
  const x = a[l]!,
    y = a[m]!,
    z = a[r]!;
  if ((x <= y && y <= z) || (z <= y && y <= x)) return m;
  if ((y <= x && x <= z) || (z <= x && x <= y)) return l;
  return r;
}
export function quickselectMed3(arr: number[], k: number, hooks: Q3Hooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    if (left === right) {
      hooks.onResult?.(a[left]!);
      return a[left]!;
    }
    const mid = Math.floor((left + right) / 2);
    const pi = med3(a, left, mid, right);
    const pivot = a[pi]!;
    hooks.onPivot?.(pivot);
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++)
      if (a[j]! < pivot) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        i++;
      }
    [a[i], a[right]] = [a[right]!, a[i]!];
    const rank = i - left;
    if (kk === rank) {
      hooks.onResult?.(a[i]!);
      return a[i]!;
    }
    if (kk < rank) return rec(left, i - 1, kk);
    return rec(i + 1, right, kk - rank - 1);
  }
  return rec(0, a.length - 1, k);
}
