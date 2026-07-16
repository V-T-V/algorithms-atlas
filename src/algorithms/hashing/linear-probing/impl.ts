// =============================================================================
// 线性探测哈希（Linear Probing）· 纯算法实现
// 开放寻址法：冲突时探测 i+1, i+2, i+3 …
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 哈希/探测/插入/冲突。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = number | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LinearProbingHooks {
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
 * 线性探测哈希表。
 */
export class LinearProbing {
  readonly size: number;
  readonly slots: Slot[];

  constructor(size: number) {
    this.size = size;
    this.slots = new Array<Slot>(size).fill(null);
  }

  /**
   * 插入一个键（线性探测）。
   * 若表满或键已存在则不插入（返回 -1）。
   *
   * @param key 待插入键
   * @param hooks 可选事件钩子
   * @returns 实际落位的槽下标；-1 表示插入失败（表满）
   */
  insert(key: number, hooks: LinearProbingHooks = {}): number {
    const start = hashKey(key, this.size);
    hooks.onHash?.(key, start);
    for (let i = 0; i < this.size; i++) {
      const slot = (start + i) % this.size;
      hooks.onProbe?.(i, slot);
      const cur = this.slots[slot];
      if (cur === null) {
        this.slots[slot] = key;
        hooks.onInsert?.(key, slot);
        return slot;
      }
      // 已存在相同键：直接返回（去重）
      if (cur === key) return slot;
      hooks.onCollision?.(slot);
    }
    return -1; // 表满
  }

  /**
   * 查找键。
   * @returns 命中槽下标；未命中返回 -1
   */
  search(key: number, hooks: LinearProbingHooks = {}): number {
    const start = hashKey(key, this.size);
    hooks.onHash?.(key, start);
    for (let i = 0; i < this.size; i++) {
      const slot = (start + i) % this.size;
      hooks.onProbe?.(i, slot);
      const cur = this.slots[slot];
      if (cur === null) {
        hooks.onFind?.(key, null);
        return -1; // 遇到空槽：键不存在
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
 * @returns 构造好的 LinearProbing 实例
 */
export function linearProbing(
  keys: readonly number[],
  size: number,
  hooks: LinearProbingHooks = {},
): LinearProbing {
  const table = new LinearProbing(size);
  for (const k of keys) table.insert(k, hooks);
  return table;
}
