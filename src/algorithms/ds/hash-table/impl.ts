// =============================================================================
// 哈希表（链地址） Hash Table (Chaining) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：定长桶数组 + 每桶一条链表（解决冲突）。
//   - hash(key) = 字符串散列后对桶数取模（djb2 变体，确定性、可复现）。
// =============================================================================

/** 桶中的键值节点。 */
export interface HashEntry {
  key: string;
  value: number;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface HashTableHooks {
  /** 计算得到 key 的桶号。 */
  onHash?: (key: string, slot: number) => void;
  /** 插入：遍历桶内链表比较 key（found 表示已存在）。 */
  onCompare?: (slot: number, key: string, found: boolean) => void;
  /** 插入：成功插入新节点到桶 slot（链表头插）。 */
  onInsert?: (slot: number, key: string, value: number) => void;
  /** 插入：已存在，更新其值。 */
  onUpdate?: (slot: number, key: string, oldValue: number, newValue: number) => void;
  /** 查找/删除：在桶 slot 内逐项比较 key，hit 表示是否匹配。 */
  onProbe?: (slot: number, idxInBucket: number, key: string, hit: boolean) => void;
  /** 查找结束。 */
  onResult?: (
    kind: 'get' | 'delete',
    key: string,
    found: boolean,
    value: number | undefined,
  ) => void;
}

/**
 * 哈希表（链地址法 / Separate Chaining）。
 * 固定桶数；冲突时同桶用链表串联。
 */
export class HashTable {
  /** 桶数组：每桶一个链表（数组头插）。 */
  private buckets: HashEntry[][];
  /** 桶数。 */
  readonly capacity: number;
  /** 当前元素数。 */
  private count = 0;

  constructor(capacity = 7) {
    this.capacity = Math.max(1, capacity);
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /** djb2 风格字符串散列（确定性）。 */
  private hash(key: string): number {
    let h = 5381;
    for (let i = 0; i < key.length; i++) {
      h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // 无符号 32 位
    }
    return h % this.capacity;
  }

  /** 元素个数。 */
  get size(): number {
    return this.count;
  }

  /** 是否为空。 */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /** 负载因子 = 元素数 / 桶数。 */
  loadFactor(): number {
    return this.count / this.capacity;
  }

  /** 插入或更新 key → value。返回是否为新增。 */
  put(key: string, value: number, hooks: HashTableHooks = {}): boolean {
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
    bucket.unshift({ key, value }); // 头插
    this.count++;
    hooks.onInsert?.(slot, key, value);
    return true;
  }

  /** 取 key 对应值；不存在返回 undefined。 */
  get(key: string, hooks: HashTableHooks = {}): number | undefined {
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
  delete(key: string, hooks: HashTableHooks = {}): boolean {
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

  /** 桶快照（用于断言/可视化）。 */
  snapshot(): HashEntry[][] {
    return this.buckets.map((b) => b.map((e) => ({ ...e })));
  }
}

/**
 * 便利函数：批量插入构建哈希表，返回 HashTable 实例。
 */
export function hashTable(
  entries: ReadonlyArray<{ key: string; value: number }>,
  capacity = 7,
  hooks: HashTableHooks = {},
): HashTable {
  const ht = new HashTable(capacity);
  for (const { key, value } of entries) ht.put(key, value, hooks);
  return ht;
}
