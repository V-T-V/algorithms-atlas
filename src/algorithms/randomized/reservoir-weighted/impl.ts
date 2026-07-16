// =============================================================================
// 加权蓄水池抽样（A-Res 算法）· 纯算法实现
// 每项优先级 key = u^(1/w)；最小堆维护前 k 大 key。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface WeightedReservoirHooks {
  /** 处理流中第 i 项：计算出的优先级 key、是否进入蓄水池。 */
  onItem?: (index: number, weight: number, key: number, admitted: boolean) => void;
  /** 蓄水池已满后，新项替换堆顶。 */
  onEvict?: (evictedIndex: number, admittedIndex: number) => void;
}

/** 蓄水池条目。 */
export interface ReservoirEntry {
  index: number; // 原始流下标
  weight: number;
  key: number; // 优先级 u^(1/w)
}

/** 简单最小堆（按 key 升序），容量 k。 */
class MinHeap {
  readonly data: ReservoirEntry[] = [];
  constructor(private readonly capacity: number) {}

  get size(): number {
    return this.data.length;
  }

  peekMin(): ReservoirEntry | undefined {
    return this.data[0];
  }

  push(e: ReservoirEntry): ReservoirEntry | undefined {
    // 若未满，直接加入并上浮
    if (this.data.length < this.capacity) {
      this.data.push(e);
      this.siftUp(this.data.length - 1);
      return undefined;
    }
    // 已满：若新 key 大于堆顶，替换
    if (e.key > this.data[0]!.key) {
      const evicted = this.data[0]!;
      this.data[0] = e;
      this.siftDown(0);
      return evicted;
    }
    return undefined; // 不接纳
  }

  private siftUp(i: number): void {
    let idx = i;
    while (idx > 0) {
      const parent = (idx - 1) >> 1;
      if (this.data[idx]!.key < this.data[parent]!.key) {
        [this.data[idx], this.data[parent]] = [this.data[parent]!, this.data[idx]!];
        idx = parent;
      } else break;
    }
  }

  private siftDown(i: number): void {
    const n = this.data.length;
    let idx = i;
    while (true) {
      const l = 2 * idx + 1;
      const r = 2 * idx + 2;
      let smallest = idx;
      if (l < n && this.data[l]!.key < this.data[smallest]!.key) smallest = l;
      if (r < n && this.data[r]!.key < this.data[smallest]!.key) smallest = r;
      if (smallest === idx) break;
      [this.data[idx], this.data[smallest]] = [this.data[smallest]!, this.data[idx]!];
      idx = smallest;
    }
  }
}

/** 确定性 RNG。 */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/**
 * A-Res 加权蓄水池抽样。
 *
 * @param weights 各项权重数组
 * @param k 蓄水池大小
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 蓄水池中的条目（k 个，或全部当 n < k）
 */
export function weightedReservoir(
  weights: readonly number[],
  k: number,
  rng: Rng = Math.random,
  hooks: WeightedReservoirHooks = {},
): ReservoirEntry[] {
  if (k <= 0) return [];
  const heap = new MinHeap(k);

  for (let i = 0; i < weights.length; i++) {
    const w = weights[i]!;
    if (w <= 0) continue; // 零权重跳过
    const u = rng();
    // 避免 u=0 导致 key=0；u^(1/w)
    const key = Math.pow(u, 1 / w);
    const evicted = heap.push({ index: i, weight: w, key });
    const admitted = evicted !== undefined ? true : heap.size < k + 1; // 简化
    hooks.onItem?.(i, w, key, evicted !== undefined || heap.size <= k);
    if (evicted !== undefined) {
      hooks.onEvict?.(evicted.index, i);
    }
    void admitted;
  }

  return [...heap.data];
}

/**
 * 便捷：返回被选中项的下标数组。
 */
export function sampleWeighted(
  weights: readonly number[],
  k: number,
  rng: Rng = Math.random,
): number[] {
  const entries = weightedReservoir(weights, k, rng);
  return entries.map((e) => e.index);
}
