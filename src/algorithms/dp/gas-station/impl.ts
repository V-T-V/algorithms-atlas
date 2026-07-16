// =============================================================================
// 加油站 Gas Station · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 134）：环形加油站，gas[i] 加油、cost[i] 耗油，求能跑完一圈的起点。
// 采用贪心：总油量≥总耗油必有解；从左扫，tank 一旦为负就重置起点。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GasStationHooks {
  /** 扫描到站 i，当前累计油量 tank。 */
  onVisit?: (i: number, tank: number) => void;
  /** tank 跌至负值，将起点重置为 i+1。 */
  onReset?: (i: number, newStart: number) => void;
  /** 算法完成：可行起点（无解为 -1）。 */
  onDone?: (start: number, totalSurplus: number) => void;
}

/**
 * 加油站（LeetCode 134）：N 个加油站组成环形，`gas[i]` 为该站可加的油，`cost[i]` 为开到下一站耗费的油。
 * 任一油箱初始为空，求一个起点下标，使从该站出发按顺序绕一圈（若存在）；无解返回 -1。
 *
 * 贪心（一次扫描）：\n- 记 `surplus[i] = gas[i] - cost[i]`。若 `Σsurplus ≥ 0`，则**必有解**；否则无解返回 -1\n- 从 `i=0` 起，累计 `tank += surplus[i]`；一旦 `tank < 0`，说明 `[start..i]` 任一点作起点都会在 `i` 处断油，故把 `start = i+1`、`tank = 0` 重置\n- 最终 `start` 即答案（前提是总 surplus ≥ 0）\n\n关键性质：若能从 A 到 B 之前断油，则 A、B 之间任意点作起点都会在 B 之前断油（因少了 A 的累计）。
 *
 * 时间 `O(n)`，空间 `O(1)`。
 *
 * @param gas 各站加油量
 * @param cost 各站到下一站的耗油量
 * @returns 可行起点下标；无解 -1
 */
export function gasStation(
  gas: readonly number[],
  cost: readonly number[],
  hooks: GasStationHooks = {},
): number {
  const n = gas.length;
  if (n === 0) {
    hooks.onDone?.(-1, 0);
    return -1;
  }
  if (gas.length !== cost.length) {
    hooks.onDone?.(-1, 0);
    return -1;
  }

  let total = 0; // 总净余油
  let tank = 0; // 当前段累计
  let start = 0;
  for (let i = 0; i < n; i++) {
    const diff = gas[i]! - cost[i]!;
    total += diff;
    tank += diff;
    hooks.onVisit?.(i, tank);
    if (tank < 0) {
      hooks.onReset?.(i, i + 1);
      start = i + 1;
      tank = 0;
    }
  }

  const result = total >= 0 ? start % n : -1;
  hooks.onDone?.(result, total);
  return result;
}
