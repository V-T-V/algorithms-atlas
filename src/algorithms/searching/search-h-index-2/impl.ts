// H 指数 · 纯算法实现
export interface HIndex2Hooks {
  onStep?: (i: number, value: number) => void;
}

export function hIndex2(citations: readonly number[], hooks: HIndex2Hooks = {}): number {
  const sorted = [...citations].sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < sorted.length; i++) {
    hooks.onStep?.(i, sorted[i]!);
    if (sorted[i]! >= i + 1) h = i + 1;
    else break;
  }
  return h;
}
