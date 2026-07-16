// 加油站 · 实现
export interface GasHooks {
  onStep?: (i: number, tank: number, total: number) => void;
  onConclude?: (start: number, feasible: boolean) => void;
}
export interface GasResult {
  start: number;
  feasible: boolean;
}
export function greedyGas3(
  gas: readonly number[],
  cost: readonly number[],
  hooks: GasHooks = {},
): GasResult {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i]! - cost[i]!;
    total += diff;
    tank += diff;
    hooks.onStep?.(i, tank, total);
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  const feasible = total >= 0;
  hooks.onConclude?.(feasible ? start : -1, feasible);
  return { start: feasible ? start : -1, feasible };
}
