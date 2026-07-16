// =============================================================================
// 搜索重复元素（Search Duplicate）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

export interface DupRange {
  found: boolean;
  first: number; // 首次出现下标；未找到为 -1
  last: number; // 末次出现下标；未找到为 -1
  count: number; // 出现次数
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SearchDuplicateHooks {
  /** 第一阶段：最左二分探测 mid。cmp 表示 a[mid] 与 target 的关系。 */
  onLeftProbe?: (mid: number, cmp: number) => void;
  /** 第二阶段：最右二分探测 mid。 */
  onRightProbe?: (mid: number, cmp: number) => void;
  /** 完成，给出结果。 */
  onDone?: (result: DupRange) => void;
}

/** 最左二分：返回 a 中等于 target 的最左下标，不存在返回 -1。 */
function leftmost(
  arr: readonly number[],
  target: number,
  hook?: (mid: number, cmp: number) => void,
): number {
  const n = arr.length;
  let lo = 0;
  let hi = n - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid]!;
    const cmp = v < target ? -1 : v > target ? 1 : 0;
    hook?.(mid, cmp);
    if (cmp === 0) {
      ans = mid;
      hi = mid - 1; // 继续向左找
    } else if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}

/** 最右二分：返回 a 中等于 target 的最右下标，不存在返回 -1。 */
function rightmost(
  arr: readonly number[],
  target: number,
  hook?: (mid: number, cmp: number) => void,
): number {
  const n = arr.length;
  let lo = 0;
  let hi = n - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid]!;
    const cmp = v < target ? -1 : v > target ? 1 : 0;
    hook?.(mid, cmp);
    if (cmp === 0) {
      ans = mid;
      lo = mid + 1; // 继续向右找
    } else if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}

/**
 * 搜索重复元素：求升序数组中 target 的出现区间。
 *
 * @param arr 升序数组（可含重复）
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function searchDuplicate(
  arr: readonly number[],
  target: number,
  hooks: SearchDuplicateHooks = {},
): DupRange {
  const first = leftmost(arr, target, hooks.onLeftProbe);
  if (first < 0) {
    const res: DupRange = { found: false, first: -1, last: -1, count: 0 };
    hooks.onDone?.(res);
    return res;
  }
  const last = rightmost(arr, target, hooks.onRightProbe);
  const res: DupRange = { found: true, first, last, count: last - first + 1 };
  hooks.onDone?.(res);
  return res;
}
