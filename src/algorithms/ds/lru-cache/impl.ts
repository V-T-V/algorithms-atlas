// =============================================================================
// LRU 缓存 LRUCache · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：Map（保持插入顺序）+ 双向链表概念。get/put 均摊 O(1)。
//   - Map 的迭代顺序即为「最近使用顺序」：first = 最久未用，last = 最近用。
//   - 命中即删除并重新插入到末尾（更新位置）；满时淘汰 first。
// =============================================================================

/** LRU 操作过程中的事件钩子。任一可选。 */
export interface LruHooks<K = string, V = number> {
  /** get 命中 key。 */
  onHit?: (key: K, value: V) => void;
  /** get 未命中 key。 */
  onMiss?: (key: K) => void;
  /** 发生淘汰：淘汰 key（最久未用）。 */
  onEvict?: (key: K, value: V) => void;
  /** put 写入（新插入或更新）：key/value，isNew 表示是否新建条目。 */
  onPut?: (key: K, value: V, isNew: boolean) => void;
}

/**
 * LRU 缓存（最近最少使用淘汰）。键值泛型，默认 string→number。
 * 用 JavaScript Map 维护访问顺序，所有操作均摊 O(1)。
 */
export class LRUCache<K = string, V = number> {
  /** 有序映射：迭代顺序 = 最近使用顺序。 */
  private readonly map = new Map<K, V>();
  /** 容量上限。 */
  private readonly cap: number;

  constructor(capacity: number) {
    if (capacity < 1) capacity = 1;
    this.cap = capacity;
  }

  /** 当前条目数。 */
  get size(): number {
    return this.map.size;
  }

  /** 获取 key：命中则更新位置并返回值；未命中返回 undefined。 */
  get(key: K, hooks: LruHooks<K, V> = {}): V | undefined {
    if (!this.map.has(key)) {
      hooks.onMiss?.(key);
      return undefined;
    }
    const value = this.map.get(key) as V;
    // 删除后重新插入到末尾，标记为最近使用
    this.map.delete(key);
    this.map.set(key, value);
    hooks.onHit?.(key, value);
    return value;
  }

  /** 写入 key/value：已存在则更新并提到末尾；不存在则插入，必要时淘汰最旧。 */
  put(key: K, value: V, hooks: LruHooks<K, V> = {}): void {
    if (this.map.has(key)) {
      this.map.delete(key);
      this.map.set(key, value);
      hooks.onPut?.(key, value, false);
      return;
    }
    if (this.map.size >= this.cap) {
      // Map 的 first key 为最久未用
      const oldest = this.map.keys().next().value as K;
      const oldVal = this.map.get(oldest) as V;
      this.map.delete(oldest);
      hooks.onEvict?.(oldest, oldVal);
    }
    this.map.set(key, value);
    hooks.onPut?.(key, value, true);
  }

  /** 当前缓存按「最旧→最新」顺序的键（用于渲染）。 */
  keysOldestFirst(): K[] {
    return [...this.map.keys()];
  }

  /** 当前缓存条目（最旧→最新）。 */
  entries(): Array<{ key: K; value: V }> {
    const out: Array<{ key: K; value: V }> = [];
    for (const [key, value] of this.map) out.push({ key, value });
    return out;
  }

  /** 是否包含 key。 */
  has(key: K): boolean {
    return this.map.has(key);
  }
}

/** 操作序列：便于 trace/测试驱动。get 用 null 表示「预期未命中」。 */
export interface LruOps<K = string, V = number> {
  capacity: number;
  /** put 序列：先建容量，再依次执行；可选穿插 get。 */
  steps: ReadonlyArray<
    { op: 'put'; key: K; value: V } | { op: 'get'; key: K; expect?: V | undefined }
  >;
}

/**
 * 便利函数：按 ops 序列驱动 LRUCache，返回最终缓存的键顺序（最旧→最新）。
 * 每步通过 hooks 暴露。
 */
export function lruCache<K = string, V = number>(
  ops: LruOps<K, V>,
  hooks: LruHooks<K, V> = {},
): K[] {
  const cache = new LRUCache<K, V>(ops.capacity);
  for (const s of ops.steps) {
    if (s.op === 'put') cache.put(s.key, s.value, hooks);
    else cache.get(s.key, hooks);
  }
  return cache.keysOldestFirst();
}
