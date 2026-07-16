// =============================================================================
// 计数布隆过滤器 · 纯算法实现
// m 个计数器 + k 个独立哈希（FNV-1a 双重派生）。支持插入/删除/查询。
// =============================================================================

/** 事件钩子。 */
export interface CountingBloomHooks {
  /** add 时计算第 i 个哈希位（0-based）。 */
  onHash?: (key: string, hashIndex: number, slot: number) => void;
  /** add 时某槽计数 +1（返回新计数）。 */
  onIncrement?: (slot: number, oldCount: number, newCount: number) => void;
  /** remove 时某槽计数 -1。 */
  onDecrement?: (slot: number, oldCount: number, newCount: number) => void;
  /** contains 检查某槽。 */
  onCheck?: (slot: number, count: number) => void;
  /** 操作完成。 */
  onResult?: (key: string, op: 'add' | 'remove' | 'contains', value: number | boolean) => void;
}

/**
 * 计数布隆过滤器。
 * 用 k 个哈希函数（Kirsch-Mitzenmacher：g_i(x) = h1(x) + i*h2(x)）对 m 个计数器增/减/查询。
 */
export class CountingBloomFilter {
  readonly size: number; // m：计数器数
  readonly hashCount: number; // k：哈希函数个数
  readonly maxCount: number; // 单计数器上界（防溢出）
  /** 计数器数组。 */
  readonly counters: number[];

  constructor(size: number, hashCount: number, counterBits: number = 4) {
    if (size <= 0 || hashCount <= 0 || counterBits <= 0) {
      throw new Error('size, hashCount, counterBits must be positive');
    }
    this.size = size;
    this.hashCount = hashCount;
    this.maxCount = (1 << counterBits) - 1; // 如 4 位 → 15
    this.counters = new Array<number>(size).fill(0);
  }

  /** FNV-1a 32 位。 */
  private fnv1a(str: string, salt: number): number {
    let h = 0x811c9dc5 ^ salt;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /**
   * 计算键的第 i 个哈希槽（Kirsch-Mitzenmacher：g_i(x) = h1(x) + i*h2(x)）。
   */
  slotOf(key: string, i: number): number {
    const h1 = this.fnv1a(key, 0);
    const h2 = this.fnv1a(key, 0x9e3779b9);
    const slot = (h1 + i * h2) % this.size;
    return ((slot % this.size) + this.size) % this.size;
  }

  /** 插入元素：k 个槽各 +1。 */
  add(key: string, hooks: CountingBloomHooks = {}): void {
    for (let i = 0; i < this.hashCount; i++) {
      const slot = this.slotOf(key, i);
      hooks.onHash?.(key, i, slot);
      const old = this.counters[slot]!;
      const next = Math.min(old + 1, this.maxCount);
      this.counters[slot] = next;
      hooks.onIncrement?.(slot, old, next);
    }
    hooks.onResult?.(key, 'add', true);
  }

  /**
   * 删除元素：k 个槽各 -1（不低于 0）。
   * 注意：仅当元素确实曾插入时调用，否则可能破坏其他元素共享的计数器。
   */
  remove(key: string, hooks: CountingBloomHooks = {}): void {
    for (let i = 0; i < this.hashCount; i++) {
      const slot = this.slotOf(key, i);
      hooks.onHash?.(key, i, slot);
      const old = this.counters[slot]!;
      const next = Math.max(old - 1, 0);
      this.counters[slot] = next;
      hooks.onDecrement?.(slot, old, next);
    }
    hooks.onResult?.(key, 'remove', true);
  }

  /**
   * 查询：若所有 k 个槽 > 0 返回 true（可能存在）；
   * 任一槽为 0 返回 false（一定不在）。
   */
  contains(key: string, hooks: CountingBloomHooks = {}): boolean {
    for (let i = 0; i < this.hashCount; i++) {
      const slot = this.slotOf(key, i);
      hooks.onHash?.(key, i, slot);
      const count = this.counters[slot]!;
      hooks.onCheck?.(slot, count);
      if (count === 0) {
        hooks.onResult?.(key, 'contains', false);
        return false;
      }
    }
    hooks.onResult?.(key, 'contains', true);
    return true;
  }

  /** 非空计数器数（观测填充率）。 */
  countNonZero(): number {
    let c = 0;
    for (const v of this.counters) if (v > 0) c++;
    return c;
  }

  /** 计数总和。 */
  totalCount(): number {
    let s = 0;
    for (const v of this.counters) s += v;
    return s;
  }
}
