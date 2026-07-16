// 平衡快速选择 · 实现
export interface BsHooks {
  onPartition?: (l: number, r: number, p: number) => void;
  onResult?: (v: number) => void;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function balancedSelect(arr: number[], k: number, seed = 5, hooks: BsHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  let left = 0;
  let right = a.length - 1;
  let kk = k;
  while (left < right) {
    const pi = left + Math.floor(rng() * (right - left + 1));
    const pivot = a[pi]!;
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++)
      if (a[j]! < pivot) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        i++;
      }
    [a[i], a[right]] = [a[right]!, a[i]!];
    hooks.onPartition?.(left, right, i);
    const rank = i - left;
    if (kk === rank) {
      hooks.onResult?.(a[i]!);
      return a[i]!;
    }
    // 选较小一侧递归，较大一侧用循环
    if (rank > kk) right = i - 1;
    else {
      kk -= rank + 1;
      left = i + 1;
    }
  }
  hooks.onResult?.(a[left]!);
  return a[left]!;
}
