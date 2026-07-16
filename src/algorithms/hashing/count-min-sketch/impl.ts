// =============================================================================
// Count-Min Sketch · 纯算法实现
// d 行 × w 列计数矩阵；更新：每行 hash 加 c；查询：取所有行最小值。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface CmsHooks {
  /** 更新元素：每行 i 的列 col 与累加前的旧值。 */
  onUpdate?: (item: string, row: number, col: number, oldVal: number, newVal: number) => void;
  /** 查询元素：各行值与最终最小估计。 */
  onQuery?: (item: string, rowValues: number[], estimate: number) => void;
}

/** 32 位哈希函数族（用不同种子产生独立哈希）。 */
export function hashWithSeed(seed: number, item: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < item.length; i++) {
    h ^= item.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 默认种子数组（d 个互不相同的奇数种子）。 */
function makeSeeds(d: number): number[] {
  const seeds: number[] = [];
  for (let i = 0; i < d; i++) seeds.push((0x9747b28c + i * 0x9e3779b1) >>> 0);
  return seeds;
}

export class CountMinSketch {
  readonly d: number;
  readonly w: number;
  readonly table: number[][];
  readonly seeds: number[];
  private total = 0;

  constructor(d: number = 5, w: number = 16, seeds?: number[]) {
    if (d < 1 || w < 1) throw new Error('d, w 必须 ≥ 1');
    this.d = d;
    this.w = w;
    this.seeds = seeds ?? makeSeeds(d);
    this.table = [];
    for (let i = 0; i < d; i++) {
      this.table.push(new Array<number>(w).fill(0));
    }
  }

  /** 更新元素计数（默认 +1）。 */
  update(item: string, count: number = 1, hooks: CmsHooks = {}): void {
    for (let i = 0; i < this.d; i++) {
      const col = hashWithSeed(this.seeds[i]!, item) % this.w;
      const oldVal = this.table[i]![col]!;
      const newVal = oldVal + count;
      this.table[i]![col] = newVal;
      hooks.onUpdate?.(item, i, col, oldVal, newVal);
    }
    this.total += count;
  }

  /** 估计元素频率（≥ 真实值）。 */
  estimate(item: string, hooks: CmsHooks = {}): number {
    const rowValues: number[] = [];
    let min = Infinity;
    for (let i = 0; i < this.d; i++) {
      const col = hashWithSeed(this.seeds[i]!, item) % this.w;
      const v = this.table[i]![col]!;
      rowValues.push(v);
      if (v < min) min = v;
    }
    hooks.onQuery?.(item, rowValues, min);
    return min;
  }

  /** 已记录的总计数（所有更新之和）。 */
  get totalCount(): number {
    return this.total;
  }

  /** 合并另一草图（同维度）到本实例。 */
  merge(other: CountMinSketch): void {
    if (other.d !== this.d || other.w !== this.w) throw new Error('维度不同无法合并');
    for (let i = 0; i < this.d; i++) {
      for (let j = 0; j < this.w; j++) {
        this.table[i]![j] = this.table[i]![j]! + other.table[i]![j]!;
      }
    }
    this.total += other.total;
  }

  /** 内积估计（两流中元素共现频次之和）。 */
  innerProduct(other: CountMinSketch, item: string): number {
    if (other.d !== this.d || other.w !== this.w) throw new Error('维度不同');
    let min = Infinity;
    for (let i = 0; i < this.d; i++) {
      const col = hashWithSeed(this.seeds[i]!, item) % this.w;
      const prod = this.table[i]![col]! * other.table[i]![col]!;
      if (prod < min) min = prod;
    }
    return min;
  }
}

/** 便捷：批量更新后返回查询结果。 */
export function estimateFrequencies(
  stream: readonly string[],
  queryItems: readonly string[],
  d: number = 5,
  w: number = 16,
): Record<string, number> {
  const cms = new CountMinSketch(d, w);
  for (const it of stream) cms.update(it);
  const result: Record<string, number> = {};
  for (const q of queryItems) result[q] = cms.estimate(q);
  return result;
}
