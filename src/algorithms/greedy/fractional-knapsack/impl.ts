// =============================================================================
// 分数背包（Fractional Knapsack）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 与 0/1 背包（DP）不同：物品可切分，故贪心（按价值密度）能得到全局最优。
// =============================================================================

/** 一个物品：重量、价值（均 > 0 才有意义）。id 可选，用于追溯原始下标。 */
export interface KnapsackItem {
  weight: number;
  value: number;
  /** 原始输入中的下标（排序后仍可定位）。 */
  id?: number;
}

/** 单个物品的装填方案：取了多少（fraction ∈ [0,1]，1=整件）。 */
export interface Take {
  /** 排序后数组里的下标。 */
  index: number;
  /** 物品原始 id。 */
  id: number;
  /** 实际取走的重量。 */
  takenWeight: number;
  /** 本次取走贡献的价值。 */
  takenValue: number;
  /** 取走比例 ∈ [0,1]。 */
  fraction: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FractionalKnapsackHooks {
  /** 物品已按价值密度（value/weight）降序排序完成。给出排序后数组（含 id）。 */
  onSort?: (sorted: KnapsackItem[]) => void;
  /** 整件装入物品（参数为排序后下标）。 */
  onTakeFull?: (index: number, item: KnapsackItem, remaining: number, totalValue: number) => void;
  /** 部分装入物品（背包剩余空间不足以装下整件）。 */
  onTakeFraction?: (
    index: number,
    item: KnapsackItem,
    fraction: number,
    totalValue: number,
  ) => void;
  /** 跳过物品（重量为 0 或背包已满）。 */
  onSkip?: (index: number, item: KnapsackItem, reason: 'zero-weight' | 'full') => void;
}

/** 求解结果。 */
export interface FractionalKnapsackResult {
  /** 总价值（最大）。 */
  totalValue: number;
  /** 总重量（≤ capacity）。 */
  totalWeight: number;
  /** 各物品的取走方案（按排序后顺序）。 */
  takes: Take[];
}

/**
 * 分数背包（贪心）：物品可切分，求容量有限下价值最大。
 *
 * 贪心策略：把物品按**单位重量价值（价值密度 value/weight）**降序排序，
 * 然后依次尽量装入——能整件装就整件，装不下就把剩余空间塞满该物品的一部分。
 * 因为物品可分，局部最优即全局最优。
 *
 * @param items 物品数组（会被克隆；调用方数组不被修改）
 * @param capacity 背包容量（> 0）
 * @param hooks 可选的事件钩子
 */
export function fractionalKnapsack(
  items: readonly KnapsackItem[],
  capacity: number,
  hooks: FractionalKnapsackHooks = {},
): FractionalKnapsackResult {
  if (items.length === 0 || capacity <= 0) {
    return { totalValue: 0, totalWeight: 0, takes: [] };
  }

  // 克隆并补上 id，按价值密度降序排序；密度相同则按重量降序（先装大件）
  const sorted: KnapsackItem[] = items.map((it, i) => ({
    weight: it.weight,
    value: it.value,
    id: it.id ?? i,
  }));
  sorted.sort((a, b) => {
    const da = a.weight > 0 ? a.value / a.weight : Infinity;
    const db = b.weight > 0 ? b.value / b.weight : Infinity;
    if (db !== da) return db - da;
    return b.weight - a.weight;
  });
  hooks.onSort?.(sorted);

  let remaining = capacity;
  let totalValue = 0;
  const takes: Take[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const it = sorted[i]!;
    if (remaining <= 0) {
      hooks.onSkip?.(i, it, 'full');
      continue;
    }
    if (it.weight <= 0) {
      hooks.onSkip?.(i, it, 'zero-weight');
      continue;
    }
    if (it.weight <= remaining) {
      // 整件装入
      takes.push({
        index: i,
        id: it.id!,
        takenWeight: it.weight,
        takenValue: it.value,
        fraction: 1,
      });
      remaining -= it.weight;
      totalValue += it.value;
      hooks.onTakeFull?.(i, it, remaining, totalValue);
    } else {
      // 切分装入：塞满剩余空间
      const fraction = remaining / it.weight;
      const takenValue = it.value * fraction;
      takes.push({
        index: i,
        id: it.id!,
        takenWeight: remaining,
        takenValue,
        fraction,
      });
      totalValue += takenValue;
      remaining = 0;
      hooks.onTakeFraction?.(i, it, fraction, totalValue);
    }
  }

  return {
    totalValue,
    totalWeight: capacity - remaining,
    takes,
  };
}
