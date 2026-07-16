// =============================================================================
// 二次探测哈希（Quadratic Probing）· 纯算法实现
// 开放寻址法：冲突时探测 h + i² (i = 1, 2, 3, …)
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 哈希/探测/插入/冲突。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = number | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface QuadraticProbingHooks {
  /** 计算键的初始哈希位置。 */
  onHash?: (key: number, slot: number) => void;
  /** 探测到某槽位（i 为探测序号，0 表示初始位）。 */
  onProbe?: (index: number, slot: number) => void;
  /** 发生冲突（槽位被别的键占用）。 */
  onCollision?: (slot: number) => void;
  /** 成功插入键到 slot。 */
  onInsert?: (key: number, slot: number) => void;
  /** 查找命中/未命中。 */
  onFind?: (key: number, slot: number | null) => void;
}

/** 除留余数法哈希。 */
export function hashKey(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/**
 * 二次探测哈希表。
 * 探测序列：(h + i²) % size，i = 0,1,2,…,size-1
 */
export class QuadraticProbing {
  readonly size: number;
  readonly slots: Slot[];

  constructor(size: number) {
    this.size = size;
    this.slots = new Array<Slot>(size).fill(null);
  }

  /**
   * 插入一个键（二次探测）。
   * 若表满或键已存在则不插入（返回 -1）。
   *
   * @param key 待插入键
   * @param hooks 可选事件钩子
   * @returns 实际落位的槽下标；-1 表示插入失败
   */
  insert(key: number, hooks: QuadraticProbingHooks = {}): number {
    const start = hashKey(key, this.size);
    hooks.onHash?.(key, start);
    for (let i = 0; i < this.size; i++) {
      const slot = (start + i * i) % this.size;
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
  search(key: number, hooks: QuadraticProbingHooks = {}): number {
    const start = hashKey(key, this.size);
    hooks.onHash?.(key, start);
    for (let i = 0; i < this.size; i++) {
      const slot = (start + i * i) % this.size;
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
 * @returns 构造好的 QuadraticProbing 实例
 */
export function quadraticProbing(
  keys: readonly number[],
  size: number,
  hooks: QuadraticProbingHooks = {},
): QuadraticProbing {
  const table = new QuadraticProbing(size);
  for (const k of keys) table.insert(k, hooks);
  return table;
}
