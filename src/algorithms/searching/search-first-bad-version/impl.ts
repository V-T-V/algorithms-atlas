// =============================================================================
// 找第一个坏版本（First Bad Version）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FirstBadHooks {
  /** 在下标 mid 处查询 isBad，得到结果。 */
  onProbe?: (mid: number, bad: boolean) => void;
  /** 完成，给出第一个坏版本。 */
  onDone?: (firstBad: number) => void;
}

/**
 * 找第一个坏版本：版本 1..n，isBad 单调（坏后皆坏）。
 *
 * @param n 版本总数
 * @param isBad 谓词：是否坏版本
 * @param hooks 可选的事件钩子
 * @returns 第一个坏版本号
 */
export function firstBadVersion(
  n: number,
  isBad: (v: number) => boolean,
  hooks: FirstBadHooks = {},
): number {
  let lo = 1;
  let hi = n;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1); // 防溢出
    const bad = isBad(mid);
    hooks.onProbe?.(mid, bad);
    if (bad) hi = mid;
    else lo = mid + 1;
  }
  hooks.onDone?.(lo);
  return lo;
}
