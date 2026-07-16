// =============================================================================
// 哈希集合 Hash Set（链地址） · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：定长桶数组 + 每桶一条链表（解决冲突）。
//   - hash(key) = djb2 字符串散列后对桶数取模（确定性、可复现）。
//   - 负载因子超阈值时 rehash 扩容，均摊 O(1)。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface HashSetHooks {
  /** 计算得到 key 的桶号。 */
  onHash?: (key: string, slot: number) => void;
  /** add：遍历桶内链表比较 key（found 表示已存在）。 */
  onCompare?: (slot: number, key: string, found: boolean) => void;
  /** add：成功新增 key 到桶 slot。 */
  onAdd?: (slot: number, key: string) => void;
  /** contains / remove：在桶 slot 内逐项比较 key，hit 表示是否匹配。 */
  onProbe?: (slot: number, idxInBucket: number, key: string, hit: boolean) => void;
  /** 查找/删除结果。 */
  onResult?: (kind: 'contains' | 'remove', key: string, found: boolean) => void;
  /** rehash 扩容：旧桶数 → 新桶数。 */
  onResize?: (oldCap: number, newCap: number) => void;
}

/**
 * 哈希集合（链地址法 / Separate Chaining）。
 * 元素为字符串；冲突时同桶用链表串联；负载因子超阈值自动扩容。
 */
export class HashSet {
  private buckets: string[][];
  private bucketCount: number;
  private count = 0;
  /** 扩容阈值（负载因子）。 */
  static readonly LOAD_FACTOR = 0.75;

  constructor(capacity = 8) {
    this.bucketCount = Math.max(1, capacity);
    this.buckets = Array.from({ length: this.bucketCount }, () => []);
  }

  /** djb2 风格字符串散列（确定性）。 */
  private hash(key: string): number {
    let h = 5381;
    for (let i = 0; i < key.length; i++) {
      h = ((h << 5) + h + key.charCodeAt(i)) >>> 0;
    }
    return h % this.bucketCount;
  }

  /** 元素个数。 */
  get size(): number {
    return this.count;
  }

  /** 当前桶数。 */
  get capacity(): number {
    return this.bucketCount;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 负载因子。 */
  loadFactor(): number {
    return this.count / this.bucketCount;
  }

  /** 添加元素。返回是否为新增（已存在则返回 false）。 */
  add(key: string, hooks: HashSetHooks = {}): boolean {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (const k of bucket) {
      hooks.onCompare?.(slot, key, k === key);
      if (k === key) return false; // 已存在
    }
    bucket.push(key);
    this.count++;
    hooks.onAdd?.(slot, key);
    // 超过负载因子 → rehash 扩容
    if (this.loadFactor() > HashSet.LOAD_FACTOR) this.rehash(hooks);
    return true;
  }

  /** 是否包含 key。 */
  contains(key: string, hooks: HashSetHooks = {}): boolean {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (let i = 0; i < bucket.length; i++) {
      const hit = bucket[i] === key;
      hooks.onProbe?.(slot, i, key, hit);
      if (hit) {
        hooks.onResult?.('contains', key, true);
        return true;
      }
    }
    hooks.onResult?.('contains', key, false);
    return false;
  }

  /** 删除 key。返回是否实际删除。 */
  remove(key: string, hooks: HashSetHooks = {}): boolean {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (let i = 0; i < bucket.length; i++) {
      const hit = bucket[i] === key;
      hooks.onProbe?.(slot, i, key, hit);
      if (hit) {
        bucket.splice(i, 1);
        this.count--;
        hooks.onResult?.('remove', key, true);
        return true;
      }
    }
    hooks.onResult?.('remove', key, false);
    return false;
  }

  /** 扩容：桶数翻倍，全部 key 重新散列。 */
  private rehash(hooks: HashSetHooks): void {
    const oldCap = this.bucketCount;
    const oldBuckets = this.buckets;
    this.bucketCount = oldCap * 2;
    this.buckets = Array.from({ length: this.bucketCount }, () => []);
    for (const bucket of oldBuckets) {
      for (const k of bucket) {
        const slot = this.hash(k);
        this.buckets[slot]!.push(k);
      }
    }
    hooks.onResize?.(oldCap, this.bucketCount);
  }

  /** 全部元素（无序）。 */
  values(): string[] {
    const out: string[] = [];
    for (const b of this.buckets) for (const k of b) out.push(k);
    return out;
  }

  /** 桶快照（用于可视化）。 */
  snapshot(): string[][] {
    return this.buckets.map((b) => [...b]);
  }
}

/**
 * 便利函数：批量添加构造集合，返回元素数组（无序）。
 */
export function hashSet(keys: readonly string[], capacity = 8, hooks: HashSetHooks = {}): string[] {
  const s = new HashSet(capacity);
  for (const k of keys) s.add(k, hooks);
  return s.values();
}
