// =============================================================================
// 加油站（Gas Station Greedy）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GasStationGHooks {
  onCheck?: (i: number, tank: number) => void;
  onReset?: (start: number) => void;
  onResult?: (start: number) => void;
}

export interface GasStationGResult {
  /** 能跑完一圈的起始站点（0-based），不存在返回 -1。 */
  start: number;
}

/**
 * 加油站（LeetCode 134）：环形路 n 个站点，gas[i] 加油量，cost[i] 到下一站耗油。
 * 求能顺时针跑完一圈的起始站点下标（保证唯一或不存在）。
 *
 * 贪心：总盈余 sum(gas-cost) < 0 则无解；否则从某站出发，油箱一旦变负就重置起点。
 * @param gas 各站加油量
 * @param cost 各站到下一站耗油
 * @param hooks 可选的事件钩子
 */
export function gasStationG(
  gas: number[],
  cost: number[],
  hooks: GasStationGHooks = {},
): GasStationGResult {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i]! - cost[i]!;
    total += diff;
    tank += diff;
    hooks.onCheck?.(i, tank);
    if (tank < 0) {
      start = i + 1;
      tank = 0;
      hooks.onReset?.(start);
    }
  }
  const result = total >= 0 ? start : -1;
  hooks.onResult?.(result);
  return { start: result };
}
