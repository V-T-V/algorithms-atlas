// =============================================================================
// 队列重建 II（计数法）· 纯算法实现
// 按身高升序、k 升序排序，逐个放入第 k 个空位。
// =============================================================================

/** 人：身高 h 与前面身高 >= h 的人数 k。 */
export interface Person2 {
  h: number;
  k: number;
}

/** 算法执行过程中的事件钩子。 */
export interface QueueRecon2Hooks {
  /** 排序完成。 */
  onSort?: (order: Person2[]) => void;
  /** 把某人放入第 slot 个空位（绝对下标 pos）。 */
  onPlace?: (person: Person2, slot: number, pos: number, slots: Array<Person2 | null>) => void;
  /** 结论。 */
  onResult?: (queue: Person2[]) => void;
}

export interface QueueRecon2Result {
  queue: Person2[];
}

/**
 * 队列重建（计数法）。
 *
 * @param people [h, k] 二元组数组
 * @param hooks 可选事件钩子
 */
export function queueRecon2(
  people: ReadonlyArray<readonly [number, number]>,
  hooks: QueueRecon2Hooks = {},
): QueueRecon2Result {
  const n = people.length;
  if (n === 0) return { queue: [] };
  // 升序：身高升序，同身高 k 升序
  const sorted = [...people]
    .map(([h, k]) => ({ h, k }))
    .sort((a, b) => (a.h !== b.h ? a.h - b.h : a.k - b.k));
  hooks.onSort?.(sorted);

  const slots: Array<Person2 | null> = new Array(n).fill(null);

  for (const p of sorted) {
    // 找放置位置：k 表示「前面身高 >= h 的人数」。
    // 由于按 h 升序放置，当前人放入时所有已放置者的身高都 <= h，
    // 故「前面 >= h 的人数」=（尚未填充、将来必被 >= h 者占据的空位）
    //                       +（已放置且身高恰好 == h 的同身高者）。
    // 我们把这两类都计入 budget，在第 k 个 budget 位放下。
    let budget = 0;
    let pos = -1;
    for (let i = 0; i < n; i++) {
      if (slots[i] === null) {
        if (budget === p.k) {
          pos = i;
          break;
        }
        budget++;
      } else if (slots[i]!.h === p.h) {
        budget++;
      }
    }
    if (pos >= 0) {
      slots[pos] = { h: p.h, k: p.k };
      hooks.onPlace?.(p, p.k, pos, [...slots]);
    }
  }
  const queue: Person2[] = slots.filter((x): x is Person2 => x !== null);
  hooks.onResult?.(queue);
  return { queue };
}
