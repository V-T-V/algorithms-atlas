// =============================================================================
// Meta 二分搜索（Meta Binary Search）· 纯算法实现
// 用位运算逐位构造目标下标。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MetaBinaryHooks {
  /** 初始计算最高试探位 msb（即 ⌈log₂(n+1)⌉）。 */
  onInit?: (msb: number) => void;
  /** 在位 k 上尝试候选下标 candidate = pos + (1<<k)。 */
  onProbe?: (k: number, pos: number, candidate: number) => void;
  /** 决定保留置位（a[candidate] < target）或撤销。 */
  onDecide?: (k: number, setBit: boolean) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/** 计算 ⌈log₂(n+1)⌉，即覆盖 [0, n) 所需的最高试探位。 */
function msbFor(n: number): number {
  let k = 0;
  while (1 << (k + 1) <= n) k++;
  return k;
}

/**
 * Meta 二分搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 * 用位运算逐位构造候选下标。时间 O(log n)，空间 O(1)。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function metaBinarySearch(
  arr: readonly number[],
  target: number,
  hooks: MetaBinaryHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }

  const msb = msbFor(n);
  hooks.onInit?.(msb);

  let pos = 0;
  for (let k = msb; k >= 0; k--) {
    const candidate = pos + (1 << k);
    if (candidate >= n) {
      // 超界，跳过该位
      hooks.onProbe?.(k, pos, candidate);
      hooks.onDecide?.(k, false);
      continue;
    }
    hooks.onProbe?.(k, pos, candidate);
    if (arr[candidate]! <= target) {
      pos = candidate;
      hooks.onDecide?.(k, true);
    } else {
      hooks.onDecide?.(k, false);
    }
  }

  const found = pos >= 0 && pos < n && arr[pos]! === target ? pos : -1;
  hooks.onDone?.(found);
  return found;
}

export { msbFor };
