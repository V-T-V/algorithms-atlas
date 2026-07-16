// =============================================================================
// 换水瓶 · 纯算法实现
// =============================================================================

export interface WaterBottlesHooks {
  onDrink?: (full: number, total: number) => void;
  onExchange?: (empties: number, gained: number) => void;
}

export function numWaterBottles(
  numBottles: number,
  numExchange: number,
  hooks: WaterBottlesHooks = {},
): number {
  if (numExchange < 2) throw new Error(`numExchange 必须 >= 2 / must be >= 2, got ${numExchange}`);
  let full = numBottles;
  let empty = 0;
  let total = 0;
  while (full > 0) {
    total += full;
    hooks.onDrink?.(full, total);
    empty += full;
    full = 0;
    // 兑换
    if (empty >= numExchange) {
      const gained = Math.floor(empty / numExchange);
      full = gained;
      empty -= gained * numExchange;
      hooks.onExchange?.(gained * numExchange, gained);
    }
  }
  return total;
}

/** 数学公式版（用于验证）。 */
export function numWaterBottlesFormula(numBottles: number, numExchange: number): number {
  // 总计 = numBottles + floor((numBottles - 1) / (numExchange - 1))
  return numBottles + Math.floor((numBottles - 1) / (numExchange - 1));
}
