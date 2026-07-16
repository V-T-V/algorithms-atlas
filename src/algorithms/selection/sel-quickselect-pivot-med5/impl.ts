// median-of-5 快速选择 · 实现
export interface Q5Hooks {
  onPivot?: (pivot: number) => void;
  onResult?: (value: number) => void;
}
function median5(a: number[], idx: number[]): number {
  const vals = idx.map((i) => a[i]!).sort((x, y) => x - y);
  return vals[2]!;
}
export function quickselectMed5(arr: number[], k: number, hooks: Q5Hooks = {}): number {
  const a = [...arr];
  function rec(left: number, right: number, kk: number): number {
    if (left === right) {
      hooks.onResult?.(a[left]!);
      return a[left]!;
    }
    const n = right - left + 1;
    const idx = [0, 1, 2, 3, 4].map((i) => left + Math.floor((i * (n - 1)) / 4));
    const pi = idx.find((i) => a[i] === median5(a, idx)) ?? idx[2]!;
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
