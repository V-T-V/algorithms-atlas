// =============================================================================
// 布谷鸟哈希 Cuckoo Hashing · 纯算法实现
// 零 DOM 依赖，可独立单测。两个哈希函数 + 踢出机制，通过「钩子」暴露每一步。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = number | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CuckooHooks {
  /** 计算键的两个候选位置 h1、h2。 */
  onHash?: (key: number, h1: number, h2: number) => void;
  /** 把 key 放入表 table（0 或 1）的 slot（首次放置）。 */
  onPlace?: (table: 0 | 1, slot: number, key: number) => void;
  /** 踢出：把键 key 从 (table, slot) 移走，为腾位给新键。 */
  onKick?: (table: 0 | 1, slot: number, key: number) => void;
  /** 查找命中：键 key 在 (table, slot)。 */
  onFind?: (key: number, table: 0 | 1, slot: number) => void;
}

export interface CuckooTable {
  /** 两张哈希表，每张 size 个槽。 */
  tables: [Slot[], Slot[]];
  /** 每张表的槽位数。 */
  size: number;
}

export interface CuckooResult {
  table: CuckooTable;
  /** 总踢出次数。 */
  kicks: number;
  /** 单次插入的最大踢出链长度。 */
  maxChain: number;
  /** 插入失败的键（超过踢出上限）。 */
  failed: number[];
}

/** 两个哈希函数（除留余数法，乘不同常数以分散）。 */
export function hash1(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/** 第二哈希函数：与 h1 不同的散列，使两表位置尽量分散（整数运算，可复现）。 */
export function hash2Int(key: number, size: number): number {
  return (((Math.floor(key / size) + key * 7 + 3) % size) + size) % size;
}

/**
 * 创建空表。
 * @param size 每张表的槽位数
 */
export function createTable(size: number): CuckooTable {
  return {
    tables: [new Array(size).fill(null), new Array(size).fill(null)],
    size,
  };
}

const KICK_LIMIT_FACTOR = 8; // 踢出上限 = factor * size

/**
 * 向布谷鸟哈希表插入一个键。
 * 若超过踢出上限则放弃（返回 false）。
 *
 * @param table 哈希表
 * @param key 待插入键
 * @param hooks 可选事件钩子
 * @returns 是否插入成功
 */
export function insert(table: CuckooTable, key: number, hooks: CuckooHooks = {}): boolean {
  const { tables, size } = table;
  const h1 = hash1(key, size);
  const h2 = hash2Int(key, size);
  hooks.onHash?.(key, h1, h2);

  // 先查是否已存在（去重）
  if (tables[0][h1] === key || tables[1][h2] === key) return true;

  const limit = KICK_LIMIT_FACTOR * size;
  let curKey = key;
  let curTable: 0 | 1 = 0; // 先尝试表 0

  for (let step = 0; step <= limit; step++) {
    const slot = curTable === 0 ? hash1(curKey, size) : hash2Int(curKey, size);
    if (tables[curTable][slot] === null) {
      tables[curTable][slot] = curKey;
      hooks.onPlace?.(curTable, slot, curKey);
      return true;
    }
    // 踢出：把占位者换出
    const evicted = tables[curTable][slot]!;
    if (step > 0) hooks.onKick?.(curTable, slot, evicted);
    tables[curTable][slot] = curKey;
    if (step === 0) hooks.onPlace?.(curTable, slot, curKey);
    curKey = evicted;
    curTable = curTable === 0 ? 1 : 0; // 切换到另一张表
  }
  return false; // 超过上限
}

/**
 * 查找键：最多两次探测（两表各一次）。
 * @returns [table, slot] 或 null
 */
export function search(
  table: CuckooTable,
  key: number,
  hooks: CuckooHooks = {},
): [0 | 1, number] | null {
  const { tables, size } = table;
  const h1 = hash1(key, size);
  const h2 = hash2Int(key, size);
  hooks.onHash?.(key, h1, h2);
  if (tables[0][h1] === key) {
    hooks.onFind?.(key, 0, h1);
    return [0, h1];
  }
  if (tables[1][h2] === key) {
    hooks.onFind?.(key, 1, h2);
    return [1, h2];
  }
  return null;
}

/**
 * 批量插入构造布谷鸟哈希表。
 * @param keys 键数组
 * @param size 每张表的槽位数
 * @param hooks 可选事件钩子
 * @returns 结果（含表、踢出统计、失败键）
 */
export function cuckoo(
  keys: readonly number[],
  size: number,
  hooks: CuckooHooks = {},
): CuckooResult {
  const table = createTable(size);
  let kicks = 0;
  let maxChain = 0;
  const failed: number[] = [];

  // 包装 hooks 统计踢出
  let curInsertKicks = 0;
  const wrapped: CuckooHooks = {
    ...hooks,
    onHash: (k, h1, h2) => {
      hooks.onHash?.(k, h1, h2);
      curInsertKicks = 0;
    },
    onKick: (t, s, k) => {
      hooks.onKick?.(t, s, k);
      kicks++;
      curInsertKicks++;
    },
  };

  for (const k of keys) {
    const ok = insert(table, k, wrapped);
    if (curInsertKicks > maxChain) maxChain = curInsertKicks;
    if (!ok) failed.push(k);
  }

  return { table, kicks, maxChain, failed };
}
