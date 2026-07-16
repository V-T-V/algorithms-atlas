// =============================================================================
// 完美哈希（CHD 简化 / FKS 两级）· 纯算法实现
// 一级分桶 + 桶内二级参数重哈希 → 零冲突。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface PerfectHashHooks {
  /** 一级分桶完成，每桶的键数。 */
  onBuckets?: (bucketSizes: number[]) => void;
  /** 某桶找到无冲突的二级参数 g。 */
  onBucketResolved?: (bucketIndex: number, g: number, slotsUsed: number[]) => void;
  /** 构造完成，所有键的最终槽位映射。 */
  onResult?: (keyToSlot: Map<string, number>, tableSize: number) => void;
}

/** 32 位哈希（种子可调，用于一级与二级）。带雪崩终混，避免低位聚集。 */
function hash32(str: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // 雪崩终混：保证低位也随输入充分变化（避免后缀相似键 % 小数时聚集）
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** 完美哈希表（构造后只读查询）。 */
export class PerfectHash {
  /** 一级哈希种子。 */
  readonly seed1: number;
  /** 每桶的二级种子 g[bucket]。 */
  readonly g: number[];
  /** 全局槽位表大小。 */
  readonly tableSize: number;
  /** 桶数。 */
  readonly numBuckets: number;
  /** 每桶在全局表中的起始偏移。 */
  readonly bucketOffset: number[];
  /** 每桶的私有区域大小。 */
  readonly bucketSize: number[];
  /** 键集合（用于校验成员资格）。 */
  private readonly keySet: Set<string>;

  constructor(keys: readonly string[], seed1: number = 0x9e3779b9, hooks: PerfectHashHooks = {}) {
    if (keys.length === 0) {
      throw new Error('keys must be non-empty');
    }
    this.seed1 = seed1;
    // 去重：完美哈希定义在「互异键」集合上
    this.keySet = new Set(keys);
    const distinctKeys = [...this.keySet];
    const n = distinctKeys.length;
    this.numBuckets = Math.max(1, n); // 桶数 ≈ n
    this.g = new Array<number>(this.numBuckets).fill(0);
    this.bucketOffset = new Array<number>(this.numBuckets).fill(0);
    this.bucketSize = new Array<number>(this.numBuckets).fill(0);

    // —— 一级：按 h1(key) % numBuckets 分桶 ——
    const buckets: string[][] = Array.from({ length: this.numBuckets }, () => []);
    for (const k of distinctKeys) {
      const b = hash32(k, seed1) % this.numBuckets;
      buckets[b]!.push(k);
    }
    hooks.onBuckets?.(buckets.map((b) => b.length));

    // —— 计算每个桶的私有区域大小（k²）与全局偏移 ——
    let offset = 0;
    for (let i = 0; i < this.numBuckets; i++) {
      const k = buckets[i]!.length;
      // 区域大小 = max(1, k²)；k=1 时取 1
      const sz = Math.max(1, k * k);
      this.bucketSize[i] = sz;
      this.bucketOffset[i] = offset;
      offset += sz;
    }
    this.tableSize = Math.max(1, offset);

    const keyToSlot = new Map<string, number>();

    // —— 二级：对每个桶找种子 g，使 hash(key, g) % bucketSize 两两不同 ——
    for (let i = 0; i < this.numBuckets; i++) {
      const bucket = buckets[i]!;
      if (bucket.length === 0) continue;
      const sz = this.bucketSize[i]!;
      const baseOff = this.bucketOffset[i]!;
      let found = false;
      for (let trial = 0; trial < 10000 && !found; trial++) {
        const seed2 = (seed1 ^ Math.imul(trial + 1, 0x9e3779b1)) >>> 0;
        const localUsed = new Set<number>();
        const slots: number[] = [];
        let ok = true;
        for (const k of bucket) {
          const slot = hash32(k, seed2) % sz;
          if (localUsed.has(slot)) {
            ok = false;
            break;
          }
          localUsed.add(slot);
          slots.push(slot);
        }
        if (ok) {
          this.g[i] = seed2;
          for (let j = 0; j < bucket.length; j++) {
            const globalSlot = baseOff + slots[j]!;
            keyToSlot.set(bucket[j]!, globalSlot);
          }
          hooks.onBucketResolved?.(
            i,
            trial,
            slots.map((s) => baseOff + s),
          );
          found = true;
        }
      }
      if (!found) {
        throw new Error(`无法为桶 ${i}（${bucket.length} 键）找到无冲突二级种子`);
      }
    }

    hooks.onResult?.(keyToSlot, this.tableSize);
  }

  /**
   * 查询键的槽位（若键不在集合中，返回的槽位无意义）。
   * 查询前应先用 has 判定成员资格。
   */
  slotOf(key: string): number {
    const b = hash32(key, this.seed1) % this.numBuckets;
    const seed2 = this.g[b]!;
    const sz = this.bucketSize[b]!;
    const baseOff = this.bucketOffset[b]!;
    const localSlot = hash32(key, seed2) % sz;
    return baseOff + localSlot;
  }

  /** 键是否在构造时的集合中。 */
  has(key: string): boolean {
    return this.keySet.has(key);
  }

  /** 成员数。 */
  size(): number {
    return this.keySet.size;
  }
}
