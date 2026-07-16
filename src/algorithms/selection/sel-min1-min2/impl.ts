// 同时找最小和次小 · 实现

export interface MinMin2 {
  min1: number;
  min2: number;
}

export interface MmHooks {
  onUpdate?: (min1: number, min2: number) => void;
}

export function min1Min2(arr: readonly number[], hooks: MmHooks = {}): MinMin2 {
  if (arr.length < 2) throw new Error('至少需 2 个元素');
  let min1 = Infinity;
  let min2 = Infinity;
  for (const v of arr) {
    if (v < min1) {
      min2 = min1;
      min1 = v;
    } else if (v < min2 && v !== min1) {
      min2 = v;
    }
    hooks.onUpdate?.(min1, min2);
  }
  if (min2 === Infinity) throw new Error('次小不存在（元素全相同）');
  return { min1, min2 };
}
