// =============================================================================
// 双重哈希（Double Hashing）· 纯算法实现
// 开放寻址法：冲突时探测 (h1 + i·h2) % size，h2 为第二哈希函数。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 哈希/探测/插入/冲突。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = number | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DoubleHashingHooks {
  /** 计算键的两个哈希位置 h1（基址）、h2（步长）。 */
  onHash?: (key: number, h1: number, h2: number) => void;
  /** 探测到某槽位（i 为探测序号，0 表示初始位）。 */
  onProbe?: (index: number, slot: number) => void;
  /** 发生冲突（槽位被别的键占用）。 */
  onCollision?: (slot: number) => void;
  /** 成功插入键到 slot。 */
  onInsert?: (key: number, slot: number) => void;
  /** 查找命中/未命中。 */
  onFind?: (key: number, slot: number | null) => void;
}

/** 主哈希函数 h1：除留余数法。 */
export function hash1(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/**
 * 第二哈希函数 h2：用作探测步长。
 * 保证结果在 [1, size-1]（恒不为 0，使探测能覆盖全表；size 为素数时与 size 互质）。
 */
export function hash2(key: number, size: number): number {
  const h = 1 + (((key % (size - 1)) + (size - 1)) % (size - 1));
  return h;
}

/**
 * 双重哈希表。
 * 探测序列：(h1(k) + i·h2(k)) % size，i = 0,1,2,…,size-1
 */
export class DoubleHashing {
  readonly size: number;
  readonly slots: Slot[];

  constructor(size: number) {
    this.size = size;
    this.slots = new Array<Slot>(size).fill(null);
  }

  /**
   * 插入一个键（双重哈希）。
   * 若表满或键已存在则不插入（返回 -1）。
   *
   * @param key 待插入键
   * @param hooks 可选事件钩子
   * @returns 实际落位的槽下标；-1 表示插入失败
   */
  insert(key: number, hooks: DoubleHashingHooks = {}): number {
    const h1 = hash1(key, this.size);
    const h2 = hash2(key, this.size);
    hooks.onHash?.(key, h1, h2);
    for (let i = 0; i < this.size; i++) {
      const slot = (h1 + i * h2) % this.size;
      hooks.onProbe?.(i, slot);
      const cur = this.slots[slot];
      if (cur === null) {
        this.slots[slot] = key;
        hooks.onInsert?.(key, slot);
        return slot;
      }
      if (cur === key) return slot; // 去重
      hooks.onCollision?.(slot);
    }
    return -1; // 探测完整个表仍未找到空位
  }

  /**
   * 查找键。
   * @returns 命中槽下标；未命中返回 -1
   */
  search(key: number, hooks: DoubleHashingHooks = {}): number {
    const h1 = hash1(key, this.size);
    const h2 = hash2(key, this.size);
    hooks.onHash?.(key, h1, h2);
    for (let i = 0; i < this.size; i++) {
      const slot = (h1 + i * h2) % this.size;
      hooks.onProbe?.(i, slot);
      const cur = this.slots[slot];
      if (cur === null) {
        hooks.onFind?.(key, null);
        return -1;
      }
      if (cur === key) {
        hooks.onFind?.(key, slot);
        return slot;
      }
      hooks.onCollision?.(slot);
    }
    hooks.onFind?.(key, null);
    return -1;
  }
}

/**
 * 批量插入构造哈希表（便于演示与测试）。
 * @param keys 键数组
 * @param size 槽位数
 * @param hooks 可选事件钩子
 * @returns 构造好的 DoubleHashing 实例
 */
export function doubleHashing(
  keys: readonly number[],
  size: number,
  hooks: DoubleHashingHooks = {},
): DoubleHashing {
  const table = new DoubleHashing(size);
  for (const k of keys) table.insert(k, hooks);
  return table;
}
