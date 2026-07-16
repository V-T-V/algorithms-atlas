// =============================================================================
// 线性查找 Linear Search · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LinearSearchHooks {
  /** 检查下标 i 处的元素（是否等于 target 的探测）。 */
  onProbe?: (i: number) => void;
  /** 查找结束，给出结果（命中下标，或 -1 表示未找到）。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 线性查找：从头到尾顺序扫描，返回第一个等于 target 的元素下标；不存在返回 -1。
 * 无需数组有序。
 * @param arr 待查找数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function linearSearch(
  arr: readonly number[],
  target: number,
  hooks: LinearSearchHooks = {},
): number {
  for (let i = 0; i < arr.length; i++) {
    hooks.onProbe?.(i);
    if (arr[i]! === target) {
      hooks.onDone?.(i);
      return i;
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
