// =============================================================================
// 加油站 II（环路）· 纯算法实现 (LeetCode 134)
// 总油 >= 总耗必有解。一次扫描找起点。
// =============================================================================
export interface GreedyGasStation2Hooks {
  onStation?: (index: number, net: number, total: number) => void;
  onAdvanceStart?: (newStart: number) => void;
  onConclude?: (start: number) => void;
}

export function greedyGasStation2(
  gas: readonly number[],
  cost: readonly number[],
  hooks: GreedyGasStation2Hooks = {},
): number {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const net = gas[i]! - cost[i]!;
    total += net;
    tank += net;
    hooks.onStation?.(i, net, total);
    if (tank < 0) {
      start = i + 1;
      hooks.onAdvanceStart?.(start);
      tank = 0;
    }
  }
  const result = total >= 0 ? start : -1;
  hooks.onConclude?.(result);
  return result;
}
