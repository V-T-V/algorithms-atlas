// =============================================================================
// 圈排序 Cycle Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CycleSortHooks {
  /** 开始一个新循环：把 item 放到它最终应处的位置 pos。 */
  onCycleStart?: (item: number, pos: number) => void;
  /** 统计有多少元素比 item 小（用于确定 item 的目标位置）。 */
  onCount?: (item: number, count: number) => void;
  /** 把值 v 写入下标 pos（可能覆盖旧值），被覆盖的旧值成为下一轮待放置的 item。 */
  onWrite?: (pos: number, v: number) => void;
  /** 一个循环结束。 */
  onCycleEnd?: (writes: number) => void;
}

/**
 * 圈排序（Cycle Sort）。
 *
 * 原理：把数组分解成若干个**置换循环**。对每个未就位的元素，计算它在有序序列中
 * 应处的位置（= 比它小的元素个数），把它写到该位置；被覆盖的旧值成为新的待放置
 * 元素，继续沿循环推进，直到回到循环起点。
 *
 * 最大优点：每个元素**最多被写一次**（写入次数 = 循环长度），写入开销最小，适合
 * 写入代价高的场景（如 EEPROM / Flash）。
 *
 * - 时间 `O(n²)`（比较次数固定，与数据分布无关）
 * - 空间 `O(1)`，原地、**不稳定**
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function cycleSort(arr: readonly number[], hooks: CycleSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = a[cycleStart]!;

    // 找出有多少元素比 item 小 → item 应放在 pos
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      if (a[i]! < item) pos++;
    }
    hooks.onCount?.(item, pos - cycleStart);
    // item 已就位（存在重复值情况），跳过
    if (pos === cycleStart) continue;
    while (item === a[pos]!) pos++; // 处理重复值：让到等值元素之后

    hooks.onCycleStart?.(item, pos);
    // 把 item 放到 pos，取出旧值
    let tmp = a[pos]!;
    a[pos] = item;
    hooks.onWrite?.(pos, item);
    item = tmp;
    let writes = 1;

    // 沿循环继续放置，直到回到 cycleStart
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (a[i]! < item) pos++;
      }
      while (item === a[pos]!) pos++;
      tmp = a[pos]!;
      a[pos] = item;
      hooks.onWrite?.(pos, item);
      item = tmp;
      writes++;
    }
    hooks.onCycleEnd?.(writes);
  }
  return a;
}
