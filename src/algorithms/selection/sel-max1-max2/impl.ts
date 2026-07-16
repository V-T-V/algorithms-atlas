// 同时找最大和次大 · 实现

export interface MaxMax2 {
  max1: number;
  max2: number;
}

export interface MxHooks {
  onUpdate?: (max1: number, max2: number) => void;
}

export function max1Max2(arr: readonly number[], hooks: MxHooks = {}): MaxMax2 {
  if (arr.length < 2) throw new Error('至少需 2 个元素');
  let max1 = -Infinity;
  let max2 = -Infinity;
  for (const v of arr) {
    if (v > max1) {
      max2 = max1;
      max1 = v;
    } else if (v > max2 && v !== max1) {
      max2 = v;
    }
    hooks.onUpdate?.(max1, max2);
  }
  if (max2 === -Infinity) throw new Error('次大不存在（元素全相同）');
  return { max1, max2 };
}
