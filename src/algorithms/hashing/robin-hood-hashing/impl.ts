// =============================================================================
// Robin Hood 哈希 · 纯算法实现
// 开放寻址 + 线性探测，插入时按 PSL（探测序列长度）抢占，降低最大探测距离。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每一步。
// =============================================================================

/** 哈希槽：null 表示空。 */
export type Slot = { key: number; psl: number } | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RobinHoodHooks {
  /** 计算键的初始 hash 位置。 */
  onHash?: (key: number, slot: number) => void;
  /** 线性探测到一个槽（step=已探测步数，residentPsl=槽中键的 psl 或 null）。 */
  onProbe?: (slot: number, step: number, residentPsl: number | null) => void;
  /** 键被放入槽（首次或抢占后落地）。 */
  onPlace?: (key: number, slot: number, psl: number) => void;
  /** 踢出：把 residentKey 从 slot 移走，为待插入键腾位。 */
  onEvict?: (residentKey: number, slot: number, residentPsl: number) => void;
}

/** 除留余数法 hash。 */
export function hash(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/**
 * 向 Robin Hood 哈希表插入一个键。
 * 若超过 size*8 步仍未找到空槽则放弃。
 *
 * @param slots 哈希表（数组，长度即 size）
 * @param key 待插入键
 * @param hooks 可选事件钩子
 * @returns 是否插入成功
 */
export function insert(slots: Slot[], key: number, hooks: RobinHoodHooks = {}): boolean {
  const size = slots.length;
  const limit = size * 8;
  const home = hash(key, size);
  hooks.onHash?.(key, home);

  // 去重：若键已存在则直接返回
  if (search(slots, key) !== null) return true;

  // 线性探测，但每次需要知道「当前键」相对其自身 home 的 PSL。
  // 抢占后，被踢出的键需要从当前位置继续向前找空位，其 PSL 继续递增。
  let curKey = key;
  let curHome = home;
  let pos = home; // 线性探测的当前位置

  for (let step = 0; step <= limit; step++) {
    const slot = pos;
    const resident = slots[slot]!;

    if (resident === null) {
      // 空槽，直接落地。PSL = (pos - curHome + size) % size
      const psl = (slot - curHome + size) % size;
      slots[slot] = { key: curKey, psl };
      hooks.onPlace?.(curKey, slot, psl);
      return true;
    }

    const myPsl = (slot - curHome + size) % size;
    hooks.onProbe?.(slot, myPsl, resident.psl);

    if (myPsl > resident.psl) {
      // 抢占：踢出 resident，curKey 占位
      hooks.onEvict?.(resident.key, slot, resident.psl);
      slots[slot] = { key: curKey, psl: myPsl };
      // 被踢出的 resident 接力：它的 home 不变，继续向前探测
      curKey = resident.key;
      curHome = hash(resident.key, size);
    }
    pos = (pos + 1) % size;
  }
  return false;
}

/**
 * 查找键。
 * Robin Hood 优化：当探测点的 resident.psl < 当前 psl 时即可提前停止
 * （被查键若存在，绝不会落在 psl 比当前更小的槽）。
 */
export function search(slots: Slot[], key: number, hooks: RobinHoodHooks = {}): number | null {
  const size = slots.length;
  const home = hash(key, size);
  hooks.onHash?.(key, home);

  for (let psl = 0; psl < size; psl++) {
    const slot = (home + psl) % size;
    const resident = slots[slot]!;
    if (resident === null) {
      hooks.onProbe?.(slot, psl, null);
      return null;
    }
    hooks.onProbe?.(slot, psl, resident.psl);
    if (resident.key === key) return slot;
    // 提前终止：被查键若存在，其 psl 不会小于当前探测点
    if (resident.psl < psl) return null;
  }
  return null;
}

/** 批量插入，返回最大 PSL 与失败的键。 */
export function robinHood(
  keys: readonly number[],
  size: number,
  hooks: RobinHoodHooks = {},
): { slots: Slot[]; maxPsl: number; failed: number[] } {
  const slots: Slot[] = new Array(size).fill(null);
  let maxPsl = 0;
  const failed: number[] = [];

  const wrapped: RobinHoodHooks = {
    ...hooks,
    onPlace: (k, slot, psl) => {
      if (psl > maxPsl) maxPsl = psl;
      hooks.onPlace?.(k, slot, psl);
    },
  };

  for (const k of keys) {
    const ok = insert(slots, k, wrapped);
    if (!ok) failed.push(k);
  }

  return { slots, maxPsl, failed };
}
