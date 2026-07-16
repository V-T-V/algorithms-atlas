// =============================================================================
// 购物折扣（贪心凑单）· 纯算法实现
// 规则：把商品分组，每组总价 >= threshold 即可减免 deduction（每组最多减免一次）。
// 求让总支付最少的分组方案。
// 贪心：降序排序，顺序累加，达到 threshold 即结组享受减免；剩下结不到组的原价。
// =============================================================================
export interface GreedyDiscountHooks {
  onSort?: (sorted: number[]) => void;
  onGroup?: (group: number[], paid: number, saved: number) => void;
  onLeftover?: (price: number) => void;
  onConclude?: (totalPaid: number, totalSaved: number) => void;
}

export interface DiscountResult {
  totalPaid: number;
  totalSaved: number;
}

export function greedyDiscount(
  prices: ReadonlyArray<number>,
  threshold: number,
  deduction: number,
  hooks: GreedyDiscountHooks = {},
): DiscountResult {
  const sorted = [...prices].sort((a, b) => b - a);
  hooks.onSort?.(sorted);

  let totalPaid = 0;
  let totalSaved = 0;
  let group: number[] = [];
  let groupSum = 0;

  const flush = () => {
    if (group.length === 0) return;
    if (groupSum >= threshold) {
      const paid = groupSum - deduction;
      totalPaid += paid;
      totalSaved += deduction;
      hooks.onGroup?.([...group], paid, deduction);
    } else {
      // 不达标：按原价逐件支付（视为 leftover）
      for (const p of group) {
        totalPaid += p;
        hooks.onLeftover?.(p);
      }
    }
    group = [];
    groupSum = 0;
  };

  for (const p of sorted) {
    group.push(p);
    groupSum += p;
    if (groupSum >= threshold) {
      flush();
    }
  }
  flush();
  hooks.onConclude?.(totalPaid, totalSaved);
  return { totalPaid, totalSaved };
}
