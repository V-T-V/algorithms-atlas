// =============================================================================
// LFU 缓存 LFUCache · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：freq(频率) → 有序键集合（用 Map 维护同频内的 LRU 顺序）。
//   - 每个 key 维护 value、freq。
//   - 同一频率内的访问顺序遵循 LRU（最旧先淘汰）。
//   - 淘汰时取最小频率桶里最旧的 key。
//   - get/put 均摊 O(1)（借助 Map 顺序）。
// =============================================================================

/** LFU 操作过程中的事件钩子。任一可选。 */
export interface LfuHooks<K = string, V = number> {
  /** get 命中 key，频率提升到 newFreq。 */
  onHit?: (key: K, value: V, newFreq: number) => void;
  /** get 未命中 key。 */
  onMiss?: (key: K) => void;
  /** 发生淘汰：被淘汰的 key、其频率与值。 */
  onEvict?: (key: K, value: V, freq: number) => void;
  /** put 写入（新插入或更新）：key/value，isNew 表示是否新建条目。 */
  onPut?: (key: K, value: V, isNew: boolean) => void;
}

interface Entry<V> {
  value: V;
  freq: number;
}

/**
 * LFU 缓存（最不经常使用淘汰）。
 * 同频率内按 LRU 淘汰。所有操作均摊 O(1)。
 */
export class LFUCache<K = string, V = number> {
  /** key → 条目。 */
  private readonly keyMap = new Map<K, Entry<V>>();
  /** freq → 有序 key 集合（Map 顺序 = 同频内的 LRU 顺序）。 */
  private readonly freqMap = new Map<number, Map<K, true>>();
  /** 当前最小频率。 */
  private minFreq = 0;
  private readonly cap: number;

  constructor(capacity: number) {
    if (capacity < 1) capacity = 1;
    this.cap = capacity;
  }

  get size(): number {
    return this.keyMap.size;
  }

  has(key: K): boolean {
    return this.keyMap.has(key);
  }

  /** 把 key 从旧频率桶移到 newFreq 桶（更新 minFreq）。 */
  private bump(key: K, oldFreq: number, newFreq: number): void {
    const oldBucket = this.freqMap.get(oldFreq);
    oldBucket?.delete(key);
    if (oldBucket && oldBucket.size === 0) {
      this.freqMap.delete(oldFreq);
      if (this.minFreq === oldFreq) this.minFreq = newFreq;
    }
    let bucket = this.freqMap.get(newFreq);
    if (!bucket) {
      bucket = new Map<K, true>();
      this.freqMap.set(newFreq, bucket);
    }
    bucket.set(key, true);
  }

  /** 获取 key：命中则频率 +1 并返回值；未命中返回 undefined。 */
  get(key: K, hooks: LfuHooks<K, V> = {}): V | undefined {
    const e = this.keyMap.get(key);
    if (!e) {
      hooks.onMiss?.(key);
      return undefined;
    }
    const newFreq = e.freq + 1;
    this.bump(key, e.freq, newFreq);
    e.freq = newFreq;
    hooks.onHit?.(key, e.value, newFreq);
    return e.value;
  }

  /** 写入 key/value：已存在则更新值并频率 +1；不存在则插入（freq=1），必要时淘汰。 */
  put(key: K, value: V, hooks: LfuHooks<K, V> = {}): void {
    const e = this.keyMap.get(key);
    if (e) {
      e.value = value;
      const newFreq = e.freq + 1;
      this.bump(key, e.freq, newFreq);
      e.freq = newFreq;
      hooks.onPut?.(key, value, false);
      return;
    }
    if (this.keyMap.size >= this.cap) {
      // 淘汰 minFreq 桶里最旧的 key
      const bucket = this.freqMap.get(this.minFreq);
      const oldest = bucket?.keys().next().value as K | undefined;
      if (oldest !== undefined && bucket) {
        const oldEntry = this.keyMap.get(oldest) as Entry<V>;
        bucket.delete(oldest);
        if (bucket.size === 0) this.freqMap.delete(this.minFreq);
        this.keyMap.delete(oldest);
        hooks.onEvict?.(oldest, oldEntry.value, oldEntry.freq);
      }
    }
    // 新插入：freq = 1
    this.keyMap.set(key, { value, freq: 1 });
    let bucket = this.freqMap.get(1);
    if (!bucket) {
      bucket = new Map<K, true>();
      this.freqMap.set(1, bucket);
    }
    bucket.set(key, true);
    this.minFreq = 1;
    hooks.onPut?.(key, value, true);
  }

  /** 当前所有条目（key、value、freq），无特定顺序。 */
  entries(): Array<{ key: K; value: V; freq: number }> {
    const out: Array<{ key: K; value: V; freq: number }> = [];
    for (const [key, e] of this.keyMap) out.push({ key, value: e.value, freq: e.freq });
    return out;
  }

  /** 当前最小频率（用于断言/渲染）。 */
  get minFrequency(): number {
    return this.minFreq;
  }
}

/** 操作序列。 */
export interface LfuOps<K = string, V = number> {
  capacity: number;
  steps: ReadonlyArray<
    { op: 'put'; key: K; value: V } | { op: 'get'; key: K; expect?: V | undefined }
  >;
}

/**
 * 便利函数：按 ops 序列驱动 LFUCache，返回最终缓存条目。
 * 每步通过 hooks 暴露。
 */
export function lfuCache<K = string, V = number>(
  ops: LfuOps<K, V>,
  hooks: LfuHooks<K, V> = {},
): Array<{ key: K; value: V; freq: number }> {
  const cache = new LFUCache<K, V>(ops.capacity);
  for (const s of ops.steps) {
    if (s.op === 'put') cache.put(s.key, s.value, hooks);
    else cache.get(s.key, hooks);
  }
  return cache.entries();
}
