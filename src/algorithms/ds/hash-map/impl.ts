// =============================================================================
// 哈希映射 Hash Map（链地址） · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：定长桶数组 + 每桶一条链表（解决冲突）。
//   - hash(key) = djb2 字符串散列后对桶数取模（确定性、可复现）。
//   - 负载因子超阈值时 rehash 扩容，均摊 O(1)。
// =============================================================================

/** 桶中的键值节点。 */
export interface MapEntry {
  key: string;
  value: number;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface HashMapHooks {
  /** 计算得到 key 的桶号。 */
  onHash?: (key: string, slot: number) => void;
  /** put：遍历桶内链表比较 key（found 表示已存在）。 */
  onCompare?: (slot: number, key: string, found: boolean) => void;
  /** put：成功插入新节点到桶 slot。 */
  onInsert?: (slot: number, key: string, value: number) => void;
  /** put：已存在，更新其值。 */
  onUpdate?: (slot: number, key: string, oldValue: number, newValue: number) => void;
  /** get/remove：在桶 slot 内逐项比较 key，hit 表示是否匹配。 */
  onProbe?: (slot: number, idxInBucket: number, key: string, hit: boolean) => void;
  /** get/remove 结果。 */
  onResult?: (
    kind: 'get' | 'delete',
    key: string,
    found: boolean,
    value: number | undefined,
  ) => void;
  /** rehash 扩容：旧桶数 → 新桶数。 */
  onResize?: (oldCap: number, newCap: number) => void;
}

/**
 * 哈希映射（链地址法 / Separate Chaining）。
 * key → value；冲突时同桶用链表串联；负载因子超阈值自动扩容。
 */
export class HashMap {
  private buckets: MapEntry[][];
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

  /** 插入或更新 key → value。返回是否为新增。 */
  put(key: string, value: number, hooks: HashMapHooks = {}): boolean {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (const e of bucket) {
      hooks.onCompare?.(slot, key, e.key === key);
      if (e.key === key) {
        const old = e.value;
        e.value = value;
        hooks.onUpdate?.(slot, key, old, value);
        return false; // 更新
      }
    }
    bucket.push({ key, value });
    this.count++;
    hooks.onInsert?.(slot, key, value);
    if (this.loadFactor() > HashMap.LOAD_FACTOR) this.rehash(hooks);
    return true;
  }

  /** 取 key 对应值；不存在返回 undefined。 */
  get(key: string, hooks: HashMapHooks = {}): number | undefined {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (let i = 0; i < bucket.length; i++) {
      const e = bucket[i]!;
      const hit = e.key === key;
      hooks.onProbe?.(slot, i, key, hit);
      if (hit) {
        hooks.onResult?.('get', key, true, e.value);
        return e.value;
      }
    }
    hooks.onResult?.('get', key, false, undefined);
    return undefined;
  }

  /** 删除 key。返回是否实际删除。 */
  delete(key: string, hooks: HashMapHooks = {}): boolean {
    const slot = this.hash(key);
    hooks.onHash?.(key, slot);
    const bucket = this.buckets[slot]!;
    for (let i = 0; i < bucket.length; i++) {
      const e = bucket[i]!;
      const hit = e.key === key;
      hooks.onProbe?.(slot, i, key, hit);
      if (hit) {
        bucket.splice(i, 1);
        this.count--;
        hooks.onResult?.('delete', key, true, e.value);
        return true;
      }
    }
    hooks.onResult?.('delete', key, false, undefined);
    return false;
  }

  /** 是否包含 key。 */
  has(key: string): boolean {
    const slot = this.hash(key);
    return this.buckets[slot]!.some((e) => e.key === key);
  }

  /** 全部键。 */
  keys(): string[] {
    const out: string[] = [];
    for (const b of this.buckets) for (const e of b) out.push(e.key);
    return out;
  }

  /** 扩容：桶数翻倍，全部键值重新散列。 */
  private rehash(hooks: HashMapHooks): void {
    const oldCap = this.bucketCount;
    const oldBuckets = this.buckets;
    this.bucketCount = oldCap * 2;
    this.buckets = Array.from({ length: this.bucketCount }, () => []);
    for (const bucket of oldBuckets) {
      for (const e of bucket) {
        const slot = this.hash(e.key);
        this.buckets[slot]!.push({ ...e });
      }
    }
    hooks.onResize?.(oldCap, this.bucketCount);
  }

  /** 桶快照（用于断言/可视化）。 */
  snapshot(): MapEntry[][] {
    return this.buckets.map((b) => b.map((e) => ({ ...e })));
  }
}

/**
 * 便利函数：批量插入构造哈希映射，返回 HashMap 实例。
 */
export function hashMap(
  entries: ReadonlyArray<{ key: string; value: number }>,
  capacity = 8,
  hooks: HashMapHooks = {},
): HashMap {
  const m = new HashMap(capacity);
  for (const { key, value } of entries) m.put(key, value, hooks);
  return m;
}
