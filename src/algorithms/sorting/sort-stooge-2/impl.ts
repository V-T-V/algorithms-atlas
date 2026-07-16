// Stooge 排序（三段递归）· 纯算法实现
export interface Stooge2Hooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

function stooge(a: number[], lo: number, hi: number, hooks: Stooge2Hooks): void {
  if (lo >= hi) return;
  hooks.onCompare?.(lo, hi, a);
  if (a[lo]! > a[hi]!) [a[lo], a[hi]] = [a[hi]!, a[lo]!];
  if (hi - lo + 1 > 2) {
    const t = Math.floor((hi - lo + 1) / 3);
    stooge(a, lo, hi - t, hooks);
    stooge(a, lo + t, hi, hooks);
    stooge(a, lo, hi - t, hooks);
  }
}

export function stoogeSort2(arr: readonly number[], hooks: Stooge2Hooks = {}): number[] {
  const a = [...arr];
  stooge(a, 0, a.length - 1, hooks);
  return a;
}
