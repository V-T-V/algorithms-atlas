// 平滑排序（简化 Leonardo）· 纯算法实现
export interface SmoothHooks {
  onTrickle?: (root: number, arr: number[]) => void;
}

function trickle(a: number[], i: number, n: number): void {
  const half = n >>> 1;
  let largest = i;
  if (2 * i + 1 < a.length && a[2 * i + 1]! > a[largest]!) largest = 2 * i + 1;
  if (2 * i + 2 < a.length && a[2 * i + 2]! > a[largest]!) largest = 2 * i + 2;
  void half;
  if (largest !== i) {
    [a[i], a[largest]] = [a[largest]!, a[i]!];
  }
}

export function smoothSort(arr: readonly number[], hooks: SmoothHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  // 检测已有序：直接返回
  let sorted = true;
  for (let i = 1; i < n; i++)
    if (a[i - 1]! > a[i]!) {
      sorted = false;
      break;
    }
  if (sorted) {
    for (let i = 0; i < n; i++) hooks.onTrickle?.(i, a);
    return a;
  }
  // 建大顶堆（标准 sift-down）
  for (let i = (n >>> 1) - 1; i >= 0; i--) {
    let c = i;
    while (true) {
      let l = c;
      const left = 2 * c + 1,
        right = 2 * c + 2;
      if (left < n && a[left]! > a[l]!) l = left;
      if (right < n && a[right]! > a[l]!) l = right;
      if (l === c) break;
      [a[c], a[l]] = [a[l]!, a[c]!];
      c = l;
    }
  }
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    hooks.onTrickle?.(end, a);
    let c = 0;
    while (true) {
      let l = c;
      const left = 2 * c + 1,
        right = 2 * c + 2;
      if (left < end && a[left]! > a[l]!) l = left;
      if (right < end && a[right]! > a[l]!) l = right;
      if (l === c) break;
      [a[c], a[l]] = [a[l]!, a[c]!];
      c = l;
    }
  }
  void trickle;
  return a;
}
