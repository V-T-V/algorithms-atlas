// 选择排序（双栈极值）· 纯算法实现
export interface MinMaxStackHooks {
  onSelect?: (minV: number, maxV: number, arr: number[]) => void;
}

export function minmaxStackSort(arr: readonly number[], hooks: MinMaxStackHooks = {}): number[] {
  const n = arr.length;
  const remaining = [...arr];
  const out: number[] = new Array(n);
  let lo = 0,
    hi = n - 1;
  while (remaining.length > 0) {
    let minI = 0,
      maxI = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (remaining[i]! < remaining[minI]!) minI = i;
      if (remaining[i]! >= remaining[maxI]!) maxI = i;
    }
    const minV = remaining[minI]!;
    const maxV = remaining[maxI]!;
    out[lo] = minV;
    if (minI !== maxI) {
      out[hi] = maxV;
      hi--;
    }
    lo++;
    // 移除这两个（注意索引顺序）
    const hi2 = Math.max(minI, maxI);
    const lo2 = Math.min(minI, maxI);
    remaining.splice(hi2, 1);
    remaining.splice(lo2, 1);
    hooks.onSelect?.(minV, maxV, out);
  }
  return out;
}
