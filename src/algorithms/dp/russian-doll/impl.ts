// =============================================================================
// 俄罗斯套娃信封 Russian Doll Envelopes · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 354）：信封 (w,h)，一个能套进另一个当且仅当二者都严格更小，求最多嵌套层数。
// 归约为 LIS：按 w 升序、w 相同时 h 降序排序，对 h 求 LIS。
// =============================================================================

/** 一个信封：宽 w、高 h（均 > 0）。 */
export interface Envelope {
  w: number;
  h: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RussianDollHooks {
  /** 处理排序后第 i 个信封，对其高度 h 做耐心放置定位 pos。 */
  onVisit?: (i: number, env: Envelope, pos: number) => void;
  /** tails[pos] 更新为 h。 */
  onPlace?: (pos: number, h: number) => void;
  /** 算法完成：最大嵌套层数。 */
  onDone?: (depth: number) => void;
}

/**
 * 俄罗斯套娃信封（LeetCode 354）：给定信封列表，求能嵌套的最大层数（宽高都严格更小）。
 *
 * 归约 LIS：\n- 按 `w` 升序排序；`w` 相同时按 `h` **降序**排序\n- 对排序后的 `h` 序列求严格递增 LIS\n\n为何 `w` 相同时 `h` 降序？这样同宽的信封在 LIS（严格递增）里至多取一个，避免「同宽但 h 递增」被误判为可嵌套。
 *
 * 时间 `O(n log n)`，空间 `O(n)`。
 *
 * @param envelopes 信封列表
 * @returns 最大嵌套层数
 */
export function russianDoll(envelopes: readonly Envelope[], hooks: RussianDollHooks = {}): number {
  const n = envelopes.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  // 排序：w 升序，w 相同则 h 降序
  const sorted = [...envelopes].sort((a, b) => (a.w !== b.w ? a.w - b.w : b.h - a.h));

  const tails: number[] = [];
  for (let i = 0; i < n; i++) {
    const h = sorted[i]!.h;
    // 二分：第一个 tails[pos] >= h（严格递增）
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < h) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    hooks.onVisit?.(i, sorted[i]!, pos);
    if (pos === tails.length) tails.push(h);
    else tails[pos] = h;
    hooks.onPlace?.(pos, h);
  }

  hooks.onDone?.(tails.length);
  return tails.length;
}
