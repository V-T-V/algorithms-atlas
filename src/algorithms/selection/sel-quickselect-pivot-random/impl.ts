// 随机 pivot 快速选择 · 实现
export interface QrHooks {
  onPivot?: (pivot: number, idx: number) => void;
  onPartition?: (left: number, right: number, pIdx: number) => void;
  onRecurse?: (left: number, right: number, k: number) => void;
  onResult?: (value: number) => void;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function quickselectRandom(arr: number[], k: number, seed = 7, hooks: QrHooks = {}): number {
  const a = [...arr];
  const rng = makeRng(seed);
  function rec(left: number, right: number, kk: number): number {
    hooks.onRecurse?.(left, right, kk);
    if (left === right) {
      hooks.onResult?.(a[left]!);
      return a[left]!;
    }
    const pi = left + Math.floor(rng() * (right - left + 1));
    const pivot = a[pi]!;
    hooks.onPivot?.(pivot, pi);
    [a[pi], a[right]] = [a[right]!, a[pi]!];
    let i = left;
    for (let j = left; j < right; j++) {
      if (a[j]! < pivot) {
        [a[i], a[j]] = [a[j]!, a[i]!];
        i++;
      }
    }
    [a[i], a[right]] = [a[right]!, a[i]!];
    hooks.onPartition?.(left, right, i);
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
