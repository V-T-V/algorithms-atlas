// =============================================================================
// Hopscotch 哈希 · 纯算法实现
// 开放寻址 + 邻域约束 H：键必须落在 [home, home+H) 窗口内。
// 每个槽维护 H 位 hop 位图。插入时空槽若超出窗口，则反向挪动已有键腾位。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 槽：null 表示空，否则存 key 与其 home。 */
export type Slot = { key: number; home: number } | null;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface HopscotchHooks {
  onHash?: (key: number, home: number) => void;
  /** 线性探测找到一个空槽。 */
  onFreeSlot?: (slot: number) => void;
  /** 挪动：把键从 from 槽移到 to 槽。 */
  onMove?: (key: number, from: number, to: number) => void;
  /** 键落地（首次或挪动后）。 */
  onPlace?: (key: number, slot: number, home: number) => void;
  /** 插入失败（窗口内无法腾位）。 */
  onFail?: (key: number) => void;
}

export const DEFAULT_H = 4; // 演示用较小邻域

export function hash(key: number, size: number): number {
  return ((key % size) + size) % size;
}

/** 把 home 对应的 hop 位图第 offset 位置 1。 */
function setBit(bitmap: number[], home: number, offset: number): void {
  bitmap[home]! |= 1 << offset;
}

/** 查询 home 的 hop 位图第 offset 位。 */
function getBit(bitmap: number[], home: number, offset: number): number {
  return (bitmap[home]! >> offset) & 1;
}

/**
 * 插入一个键。若窗口内无法腾位则失败。
 *
 * @param slots 哈希表
 * @param bitmap 每槽的 H 位 hop 信息
 * @param H 邻域大小
 * @param key 待插入键
 * @param hooks 可选钩子
 * @returns 是否成功
 */
export function insert(
  slots: Slot[],
  bitmap: number[],
  H: number,
  key: number,
  hooks: HopscotchHooks = {},
): boolean {
  const size = slots.length;
  const home = hash(key, size);
  hooks.onHash?.(key, home);

  // 已存在则去重
  for (let off = 0; off < H; off++) {
    const idx = (home + off) % size;
    if (getBit(bitmap, home, off) === 1 && slots[idx]!.key === key) return true;
  }

  // 线性探测找最近空槽
  let free = home;
  for (let step = 0; step < size; step++) {
    const idx = (home + step) % size;
    if (slots[idx] === null) {
      free = idx;
      break;
    }
    if (step === size - 1) {
      hooks.onFail?.(key);
      return false;
    }
  }
  hooks.onFreeSlot?.(free);

  // 若空槽已在窗口内，直接占
  // 否则反复把窗口内的键往空槽方向挪
  while (true) {
    const offset = (free - home + size) % size;
    if (offset < H) {
      // free 在窗口内：落地
      slots[free] = { key, home };
      setBit(bitmap, home, offset);
      hooks.onPlace?.(key, free, home);
      return true;
    }

    // 需要在 (free-H+1, free] 范围找 home' 使其窗口覆盖 free
    let moved = false;
    for (let i = H - 1; i >= 1; i--) {
      const candidate = (free - i + size) % size;
      const resident = slots[candidate];
      if (resident === null || resident === undefined) continue;
      const rHome = resident.home;
      const rOffsetInWindow = (candidate - rHome + size) % size;
      // resident 当前位（在 rHome 窗口内 rOffsetInWindow）
      // 挪到 free 后的新位 = (free - rHome + size) % size，须 < H
      const newOffset = (free - rHome + size) % size;
      if (newOffset < H && getBit(bitmap, rHome, rOffsetInWindow) === 1) {
        // 可挪：把 resident 从 candidate 挪到 free
        slots[free] = resident;
        slots[candidate] = null;
        bitmap[rHome]! &= ~(1 << rOffsetInWindow);
        setBit(bitmap, rHome, newOffset);
        hooks.onMove?.(resident.key, candidate, free);
        free = candidate;
        moved = true;
        break;
      }
    }
    if (!moved) {
      hooks.onFail?.(key);
      return false;
    }
  }
}

/** 查找：只在 home 的 H 窗口内扫描。 */
export function search(
  slots: Slot[],
  bitmap: number[],
  H: number,
  key: number,
  hooks: HopscotchHooks = {},
): number | null {
  const size = slots.length;
  const home = hash(key, size);
  hooks.onHash?.(key, home);
  for (let off = 0; off < H; off++) {
    if (getBit(bitmap, home, off) === 1) {
      const idx = (home + off) % size;
      if (slots[idx]!.key === key) return idx;
    }
  }
  return null;
}

/** 批量插入，返回表、hop 位图、失败的键。 */
export function hopscotch(
  keys: readonly number[],
  size: number,
  H: number = DEFAULT_H,
  hooks: HopscotchHooks = {},
): { slots: Slot[]; bitmap: number[]; failed: number[] } {
  const slots: Slot[] = new Array(size).fill(null);
  const bitmap: number[] = new Array(size).fill(0);
  const failed: number[] = [];
  for (const k of keys) {
    const ok = insert(slots, bitmap, H, k, hooks);
    if (!ok) failed.push(k);
  }
  return { slots, bitmap, failed };
}
