// 双调排序（迭代）· 纯算法实现
export interface BitonicIterHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function bitonicSortIter(arr: readonly number[], hooks: BitonicIterHooks = {}): number[] {
  const a = [...arr];
  let n = 1;
  while (n < a.length) n *= 2;
  while (a.length < n) a.push(Number.MAX_SAFE_INTEGER);
  for (let k = 2; k <= n; k *= 2) {
    for (let j = k / 2; j > 0; j /= 2) {
      for (let i = 0; i < n; i++) {
        const l = i ^ j;
        if (l > i) {
          const up = (i & k) === 0;
          hooks.onCompare?.(i, l, a);
          if ((up && a[i]! > a[l]!) || (!up && a[i]! < a[l]!)) [a[i], a[l]] = [a[l]!, a[i]!];
        }
      }
    }
  }
  return a.filter((v) => v !== Number.MAX_SAFE_INTEGER);
}
