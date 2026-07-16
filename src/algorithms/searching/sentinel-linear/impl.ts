// =============================================================================
// 哨兵线性搜索（Sentinel Linear Search）· 纯算法实现
// 把目标当哨兵放末尾，省去循环内的越界判断。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SentinelLinearHooks {
  /** 扫描到下标 i（比较 a[i] 与 target）。 */
  onCompare?: (i: number) => void;
  /** 命中下标 i（真实命中，非哨兵）。 */
  onFound?: (i: number) => void;
  /** 未找到（扫到哨兵）。 */
  onNotFound?: () => void;
}

/**
 * 哨兵线性搜索：在数组中查找 target，返回其首次出现的下标；不存在返回 -1。
 * 把 target 追加为哨兵，循环只比较 a[i] === target，省去越界判断。
 * 时间 O(n)，空间 O(n)（克隆并在末尾追加哨兵）。
 *
 * @param arr 待搜索数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function sentinelLinearSearch(
  arr: readonly number[],
  target: number,
  hooks: SentinelLinearHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onNotFound?.();
    return -1;
  }

  // 在末尾追加哨兵 = target
  const a = [...arr, target];

  let i = 0;
  while (a[i]! !== target) {
    hooks.onCompare?.(i);
    i++;
  }

  if (i < n) {
    hooks.onFound?.(i);
    return i;
  }
  // i === n：哨兵命中，原数组中不存在
  hooks.onNotFound?.();
  return -1;
}
