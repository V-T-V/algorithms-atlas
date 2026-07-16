// =============================================================================
// 布隆过滤器（Bloom Filter）· 纯算法实现
// m 位的位数组 + k 个独立哈希函数（基于 FNV-1a 双重哈希派生）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 位置位/查询。
// =============================================================================

import { fnv1a } from '../fnv-hash/impl.ts';

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BloomFilterHooks {
  /** add 时计算第 i 个哈希位（0-based）。 */
  onHash?: (key: string, hashIndex: number, bit: number) => void;
  /** add 时把某位置 1（isAlreadySet 表示原本就是 1）。 */
  onSet?: (bit: number, isAlreadySet: boolean) => void;
  /** contains 时检查某位。 */
  onCheck?: (bit: number, isSet: boolean) => void;
  /** add 完成。 */
  onAdd?: (key: string) => void;
  /** contains 完成（maybe 表示可能存在，可能是假阳性）。 */
  onResult?: (key: string, maybe: boolean) => void;
}

/**
 * 布隆过滤器。
 * 用 k 个哈希函数（由 FNV-1a + 双重哈希派生）对 m 位数组置位/查询。
 */
export class BloomFilter {
  readonly size: number; // m：位数
  readonly hashCount: number; // k：哈希函数个数
  /** 位数组：false=0, true=1。 */
  readonly bits: boolean[];

  constructor(size: number, hashCount: number) {
    if (size <= 0 || hashCount <= 0) {
      throw new Error('size and hashCount must be positive');
    }
    this.size = size;
    this.hashCount = hashCount;
    this.bits = new Array<boolean>(size).fill(false);
  }

  /**
   * 计算键的第 i 个哈希位（Kirsch-Mitzenmacher：g_i(x) = h1(x) + i*h2(x)）。
   * h1 = FNV-1a(x)，h2 = FNV-1a(x + '#')，二者独立。
   */
  bitOf(key: string, i: number): number {
    const h1 = fnv1a(key);
    const h2 = fnv1a(key + '#');
    const bit = (h1 + i * h2) % this.size;
    return ((bit % this.size) + this.size) % this.size; // 确保非负
  }

  /**
   * 加入元素：把 k 个哈希位置 1。
   */
  add(key: string, hooks: BloomFilterHooks = {}): void {
    for (let i = 0; i < this.hashCount; i++) {
      const bit = this.bitOf(key, i);
      hooks.onHash?.(key, i, bit);
      const already = this.bits[bit]!;
      this.bits[bit] = true;
      hooks.onSet?.(bit, already);
    }
    hooks.onAdd?.(key);
  }

  /**
   * 查询：若所有哈希位都为 1 返回 true（可能在集合，可能假阳性）；
   * 任一位为 0 返回 false（一定不在，无假阴性）。
   */
  contains(key: string, hooks: BloomFilterHooks = {}): boolean {
    for (let i = 0; i < this.hashCount; i++) {
      const bit = this.bitOf(key, i);
      hooks.onHash?.(key, i, bit);
      const isSet = this.bits[bit]!;
      hooks.onCheck?.(bit, isSet);
      if (!isSet) {
        hooks.onResult?.(key, false);
        return false; // 一定不在
      }
    }
    hooks.onResult?.(key, true);
    return true; // 可能在
  }

  /** 已置 1 的位数（用于观测填充率）。 */
  countSetBits(): number {
    let c = 0;
    for (const b of this.bits) if (b) c++;
    return c;
  }

  /** 估计假阳性率 (1 - e^(-kn/m))^k。 */
  estimatedFpRate(n: number): number {
    const k = this.hashCount;
    const m = this.size;
    const p = 1 - Math.exp((-k * n) / m);
    return Math.pow(p, k);
  }
}

/**
 * 批量插入构造布隆过滤器（便于演示与测试）。
 * @param keys 键数组
 * @param size 位数 m
 * @param hashCount 哈希函数个数 k
 * @param hooks 可选事件钩子
 */
export function bloomFilter(
  keys: readonly string[],
  size: number,
  hashCount: number,
  hooks: BloomFilterHooks = {},
): BloomFilter {
  const bf = new BloomFilter(size, hashCount);
  for (const k of keys) bf.add(k, hooks);
  return bf;
}
