// 侏儒排序（智能回溯）· 纯算法实现
export interface GnomeOptHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function gnomeSortOpt(arr: readonly number[], hooks: GnomeOptHooks = {}): number[] {
  const a = [...arr];
  let i = 1;
  // 用一个独立游标 j 记忆「上次前进到的位置」，回溯到 0 后可直接跳回 j
  let j = 2;
  while (i < a.length) {
    if (i === 0 || a[i - 1]! <= a[i]!) {
      hooks.onCompare?.(i - 1, i, a);
      i = j;
      j++;
    } else {
      hooks.onCompare?.(i - 1, i, a);
      [a[i - 1], a[i]] = [a[i]!, a[i - 1]!];
      i--;
    }
  }
  return a;
}
