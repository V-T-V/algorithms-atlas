// =============================================================================
// 布隆过滤器 Bloom Filter · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：m 位的位数组 + k 个哈希函数（双哈希 double hashing 生成）。
//   - 加入元素：把 k 个哈希位 置 1。
//   - 查询：k 个哈希位 全为 1 才「可能在」，任一为 0 则「一定不在」。
//   - 特性：有假阳性（false positive），无假阴性（false negative）。
//   - 哈希函数用 djb2 与 sdbm 两个独立散列，按 h1 + i*h2 生成 k 个值。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface BloomFilterHooks {
  /** 计算得到 key 的第 i 个哈希位。 */
  onHash?: (key: string, i: number, bitIndex: number) => void;
  /** 加入元素：把某位置 1（wasSet 表示原本是否已为 1）。 */
  onSetBit?: (bitIndex: number, wasSet: boolean) => void;
  /** add 完成（key 已登记）。 */
  onAdd?: (key: string) => void;
  /** 查询时检查某位（isSet 表示该位当前值）。 */
  onCheckBit?: (bitIndex: number, isSet: boolean) => void;
  /** 查询结果。maybe=true 表示「可能在」，false 表示「一定不在」。 */
  onResult?: (key: string, maybe: boolean) => void;
}

/**
 * 布隆过滤器：位数组 + k 个哈希函数（双哈希）。
 * 用「位」由布尔数组模拟（语义等价，便于可视化）。
 */
export class BloomFilter {
  /** 位数组。 */
  private bits: boolean[];
  /** 位数。 */
  readonly m: number;
  /** 哈希函数个数。 */
  readonly k: number;

  constructor(m: number, k: number) {
    this.m = Math.max(1, m);
    this.k = Math.max(1, k);
    this.bits = new Array<boolean>(this.m).fill(false);
  }

  /** djb2 散列（确定性）。 */
  private hash1(key: string): number {
    let h = 5381;
    for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0;
    return h;
  }

  /** sdbm 散列（确定性，与 hash1 独立）。 */
  private hash2(key: string): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h = key.charCodeAt(i) + (h << 6) + (h << 16) - h;
      h = h >>> 0;
    }
    return h || 1; // 避免 0（否则所有 i 相同）
  }

  /** 双哈希生成第 i 个位下标。 */
  private doubleHash(h1: number, h2: number, i: number): number {
    return (h1 + i * h2) % this.m;
  }

  /** 已登记元素个数（add 次数，非精确计数）。 */
  private _count = 0;
  get count(): number {
    return this._count;
  }

  /** 当前置 1 的位数。 */
  get bitsSet(): number {
    return this.bits.reduce((acc, b) => acc + (b ? 1 : 0), 0);
  }

  /** 加入元素。 */
  add(key: string, hooks: BloomFilterHooks = {}): void {
    const h1 = this.hash1(key);
    const h2 = this.hash2(key);
    for (let i = 0; i < this.k; i++) {
      const idx = this.doubleHash(h1, h2, i);
      hooks.onHash?.(key, i, idx);
      const wasSet = this.bits[idx]!;
      this.bits[idx] = true;
      hooks.onSetBit?.(idx, wasSet);
    }
    this._count++;
    hooks.onAdd?.(key);
  }

  /** 查询：是否「可能」包含 key。 */
  contains(key: string, hooks: BloomFilterHooks = {}): boolean {
    const h1 = this.hash1(key);
    const h2 = this.hash2(key);
    for (let i = 0; i < this.k; i++) {
      const idx = this.doubleHash(h1, h2, i);
      hooks.onHash?.(key, i, idx);
      const isSet = this.bits[idx]!;
      hooks.onCheckBit?.(idx, isSet);
      if (!isSet) {
        hooks.onResult?.(key, false);
        return false; // 一定不在
      }
    }
    hooks.onResult?.(key, true);
    return true; // 可能在
  }

  /** 位数组副本（用于可视化）。 */
  toArray(): boolean[] {
    return [...this.bits];
  }

  /** 估算当前假阳性概率（基于位数组填充率）。p ≈ (1 - e^{-kn/m})^k。 */
  estimateFalsePositiveRate(n = this._count): number {
    const exponent = (-this.k * n) / this.m;
    return Math.pow(1 - Math.exp(exponent), this.k);
  }
}

/**
 * 便利函数：批量加入元素构造布隆过滤器，返回过滤器实例。
 */
export function bloomFilter(
  m: number,
  k: number,
  keys: readonly string[],
  hooks: BloomFilterHooks = {},
): BloomFilter {
  const bf = new BloomFilter(m, k);
  for (const key of keys) bf.add(key, hooks);
  return bf;
}
