// =============================================================================
// 批处理模式（懒批量化）· 纯算法实现
// BatchProcessor<T>：add 攒到阈值即 flush；也可显式 flush。
// =============================================================================

export interface BatchHooks<T> {
  /** 单个 item 入缓冲区（未达阈值）。 */
  onBuffer?: (item: T, currentSize: number) => void;
  /** 一批被 flush。 */
  onFlush?: (batch: T[], batchNumber: number) => void;
}

export interface BatchResult {
  /** flush 的批次数。 */
  batchCount: number;
  /** 处理的总 item 数。 */
  totalProcessed: number;
  /** 每批的大小。 */
  batchSizes: number[];
}

/**
 * 批处理器：把 add 的项攒到 threshold 再 flush。
 */
export class BatchProcessor<T = number> {
  private buffer: T[] = [];
  private batchNumber = 0;
  private readonly hooks: BatchHooks<T>;
  public readonly batchSizes: number[] = [];

  constructor(
    public readonly threshold: number,
    hooks: BatchHooks<T> = {},
  ) {
    if (threshold <= 0) throw new RangeError('threshold must be positive');
    this.hooks = hooks;
  }

  /** 加入一项；达阈值则自动 flush。返回是否触发了 flush。 */
  add(item: T): boolean {
    this.buffer.push(item);
    this.hooks.onBuffer?.(item, this.buffer.length);
    if (this.buffer.length >= this.threshold) {
      this.flush();
      return true;
    }
    return false;
  }

  /** 强制 flush 当前缓冲区（即使未满）。返回本批大小。 */
  flush(): number {
    if (this.buffer.length === 0) return 0;
    this.batchNumber += 1;
    const batch = [...this.buffer];
    this.batchSizes.push(batch.length);
    this.hooks.onFlush?.(batch, this.batchNumber);
    this.buffer = [];
    return batch.length;
  }

  get pending(): number {
    return this.buffer.length;
  }

  stats(): BatchResult {
    return {
      batchCount: this.batchNumber,
      totalProcessed: this.batchSizes.reduce((a, b) => a + b, 0),
      batchSizes: [...this.batchSizes],
    };
  }
}

/**
 * 便利函数：把一个元素序列按阈值分批处理。
 * @returns 每批元素组成的二维数组
 */
export function batchItems<T>(
  items: readonly T[],
  threshold: number,
  hooks: BatchHooks<T> = {},
): T[][] {
  const proc = new BatchProcessor<T>(threshold, hooks);
  const batches: T[][] = [];
  const wrapped: BatchHooks<T> = {
    onBuffer: hooks.onBuffer,
    onFlush: (batch) => {
      batches.push([...batch]);
      hooks.onFlush?.(batch, batches.length);
    },
  };
  const p = new BatchProcessor<T>(threshold, wrapped);
  void proc;
  for (const it of items) p.add(it);
  p.flush();
  return batches;
}
