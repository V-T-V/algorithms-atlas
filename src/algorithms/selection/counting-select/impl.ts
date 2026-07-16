// 计数选择 · 纯算法实现

/** 事件钩子。 */
export interface CountingSelectHooks {
  /** 统计完成，给出频数表。 */
  onCounted?: (counts: number[]) => void;
  /** 扫描值 v 时累计频数 = acc，与目标 k+1 比较。 */
  onScan?: (v: number, acc: number, target: number) => void;
  /** 命中结果。 */
  onResult?: (value: number) => void;
}

/**
 * 计数选择：在非负整数数组中找第 k 小（0-based）。
 * @param arr 非空非负整数数组
 * @param k 0-based 排名
 * @param hooks 可选事件钩子
 * @returns 第 k 小的值
 */
export function countingSelect(
  arr: readonly number[],
  k: number,
  hooks: CountingSelectHooks = {},
): number {
  if (arr.length === 0) throw new RangeError('empty array');
  if (k < 0 || k >= arr.length) throw new RangeError(`k out of range: ${k}`);
  // 仅允许非负整数
  for (const x of arr) {
    if (!Number.isInteger(x) || x < 0) {
      throw new RangeError('countingSelect requires non-negative integers');
    }
  }
  let maxV = 0;
  for (const x of arr) if (x > maxV) maxV = x;
  const cnt = new Array<number>(maxV + 1).fill(0);
  for (const x of arr) cnt[x]!++;
  hooks.onCounted?.(cnt);

  const target = k + 1;
  let acc = 0;
  for (let v = 0; v <= maxV; v++) {
    acc += cnt[v]!;
    hooks.onScan?.(v, acc, target);
    if (acc >= target) {
      hooks.onResult?.(v);
      return v;
    }
  }
  // 理论不可达
  return maxV;
}
