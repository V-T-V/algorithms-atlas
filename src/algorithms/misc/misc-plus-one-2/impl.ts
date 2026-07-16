// 加一 · 实现
export interface PlusOneHooks {
  onCarry?: (idx: number) => void;
  onConclude?: (result: number[]) => void;
}
export function miscPlusOne2(digits: readonly number[], hooks: PlusOneHooks = {}): number[] {
  const result = [...digits];
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i]! < 9) {
      result[i] = result[i]! + 1;
      hooks.onConclude?.(result);
      return result;
    }
    result[i] = 0;
    hooks.onCarry?.(i);
  }
  result.unshift(1);
  hooks.onConclude?.(result);
  return result;
}
