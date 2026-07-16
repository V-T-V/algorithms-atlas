// 最佳适应装箱 · 实现
export interface BfHooks {
  onPlace?: (item: number, bin: number, binLoad: number) => void;
  onConclude?: (binCount: number) => void;
}
export function bestFitBinPacking(
  items: readonly number[],
  capacity: number,
  hooks: BfHooks = {},
): number {
  const bins: number[] = [];
  for (let idx = 0; idx < items.length; idx++) {
    const v = items[idx]!;
    let best = -1,
      bestLeft = Infinity;
    for (let b = 0; b < bins.length; b++) {
      const left = capacity - bins[b]!;
      if (left >= v && left < bestLeft) {
        bestLeft = left;
        best = b;
      }
    }
    if (best < 0) {
      bins.push(v);
      best = bins.length - 1;
    } else bins[best]! += v;
    hooks.onPlace?.(idx, best, bins[best]!);
  }
  hooks.onConclude?.(bins.length);
  return bins.length;
}
