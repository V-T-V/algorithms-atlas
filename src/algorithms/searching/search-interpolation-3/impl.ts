// 插值查找 · 纯算法实现
export interface Interp3Hooks {
  onProbe?: (pos: number) => void;
}

export function interpolationSearch3(
  arr: readonly number[],
  target: number,
  hooks: Interp3Hooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo]! && target <= arr[hi]!) {
    if (lo === hi) {
      hooks.onProbe?.(lo);
      return arr[lo]! === target ? lo : -1;
    }
    const pos = lo + Math.floor(((target - arr[lo]!) / (arr[hi]! - arr[lo]!)) * (hi - lo));
    hooks.onProbe?.(pos);
    if (arr[pos]! === target) return pos;
    if (arr[pos]! < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}
