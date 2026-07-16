// =============================================================================
// 开放寻址哈希（Open Addressing · 线性探测）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 哈希/探测/插入/查找。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = number | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface OpenAddressingHooks {
  /** 计算键的初始哈希位置。 */
  onHash?: (key: number, slot: number) => void;
  /** 探测到某槽位（冲突时顺延）。 */
  onProbe?: (slot: number, isCollision: boolean) => void;
  /** 成功插入键到 slot。 */
  onInsert?: (key: number, slot: number) => void;
  /** 查找命中/未命中。 */
  onFind?: (key: number, slot: number | null) => void;
}

export interface OpenAddressingTable {
  /** 槽数组，null 表示空。 */
  slots: Slot[];
  /** 槽位数。 */
  size: number;
}

/** 除留余数法哈希。 */
export function hashKey(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/**
 * 创建空表。
 * @param size 槽位数（建议素数）
 */
export function createTable(size: number): OpenAddressingTable {
  return { slots: new Array(size).fill(null), size };
}

/**
 * 向开放寻址哈希表插入一个键（线性探测）。
 * 若表满或键已存在则不插入（返回 -1）。
 *
 * @param table 哈希表
 * @param key 待插入键
 * @param hooks 可选事件钩子
 * @returns 实际落位的槽下标；-1 表示插入失败（表满）
 */
export function insert(
  table: OpenAddressingTable,
  key: number,
  hooks: OpenAddressingHooks = {},
): number {
  const { slots, size } = table;
  const start = hashKey(key, size);
  hooks.onHash?.(key, start);
  for (let i = 0; i < size; i++) {
    const slot = (start + i) % size;
    const isCollision = i > 0;
    hooks.onProbe?.(slot, isCollision);
    if (slots[slot] === null) {
      slots[slot] = key;
      hooks.onInsert?.(key, slot);
      return slot;
    }
    // 已存在相同键：直接返回（去重）
    if (slots[slot] === key) {
      return slot;
    }
  }
  return -1; // 表满
}

/**
 * 查找键。
 * @returns 命中槽下标；未命中返回 -1
 */
export function search(
  table: OpenAddressingTable,
  key: number,
  hooks: OpenAddressingHooks = {},
): number {
  const { slots, size } = table;
  const start = hashKey(key, size);
  hooks.onHash?.(key, start);
  for (let i = 0; i < size; i++) {
    const slot = (start + i) % size;
    hooks.onProbe?.(slot, i > 0);
    if (slots[slot] === null) {
      hooks.onFind?.(key, null);
      return -1; // 遇到空槽：键不存在
    }
    if (slots[slot] === key) {
      hooks.onFind?.(key, slot);
      return slot;
    }
  }
  hooks.onFind?.(key, null);
  return -1;
}

/**
 * 批量插入构造哈希表（便于演示与测试）。
 * @param keys 键数组
 * @param size 槽位数
 * @param hooks 可选事件钩子
 * @returns 构造好的表（slots 数组 + size）
 */
export function openAddressing(
  keys: readonly number[],
  size: number,
  hooks: OpenAddressingHooks = {},
): OpenAddressingTable {
  const table = createTable(size);
  for (const k of keys) {
    insert(table, k, hooks);
  }
  return table;
}
