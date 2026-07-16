// =============================================================================
// 活动选择（Activity Selection）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一个活动（区间）：[start, end) 半开区间。id 可选，用于追溯原始下标。 */
export interface Activity {
  start: number;
  end: number;
  /** 原始输入中的下标（排序后仍可定位）。 */
  id?: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ActivitySelectionHooks {
  /** 活动已按结束时间排序完成。给出排序后的数组（含 id）。 */
  onSort?: (sorted: Activity[]) => void;
  /** 当前活动被选中加入结果。参数为排序后数组里的下标。 */
  onSelect?: (index: number, activity: Activity) => void;
  /** 当前活动与上一个选中的冲突（被拒绝）。参数为排序后数组里的下标。 */
  onReject?: (index: number, activity: Activity) => void;
}

/**
 * 活动选择（贪心）：从一组活动中选出最多的、互不重叠的子集。
 *
 * 贪心策略：把活动按**结束时间**升序排序，然后依次扫描，
 * 维护「上一个选中活动的结束时间 lastEnd」：若当前活动 start ≥ lastEnd，
 * 则选中它并更新 lastEnd；否则跳过。
 *
 * @param activities 活动数组（会被克隆；调用方数组不被修改）
 * @param hooks 可选的事件钩子
 * @returns 选中的活动子集（互不重叠的最大规模之一）
 */
export function activitySelection(
  activities: readonly Activity[],
  hooks: ActivitySelectionHooks = {},
): Activity[] {
  if (activities.length === 0) return [];

  // 克隆并补上 id（原始下标），按结束时间升序排序；结束时间相同按开始时间升序
  const sorted: Activity[] = activities.map((a, i) => ({
    start: a.start,
    end: a.end,
    id: a.id ?? i,
  }));
  sorted.sort((a, b) => a.end - b.end || a.start - b.start);
  hooks.onSort?.(sorted);

  const selected: Activity[] = [sorted[0]!];
  hooks.onSelect?.(0, sorted[0]!);
  let lastEnd = sorted[0]!.end;

  for (let i = 1; i < sorted.length; i++) {
    const act = sorted[i]!;
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
      hooks.onSelect?.(i, act);
    } else {
      hooks.onReject?.(i, act);
    }
  }
  return selected;
}

/**
 * 便利重载：从 `[start, end]` 二元组数组求解，返回选中元素的下标（原始顺序）。
 */
export function activitySelectionIndices(
  pairs: ReadonlyArray<readonly [number, number]>,
  hooks: ActivitySelectionHooks = {},
): number[] {
  const acts: Activity[] = pairs.map(([start, end], i) => ({ start, end, id: i }));
  return activitySelection(acts, hooks).map((a) => a.id ?? 0);
}
