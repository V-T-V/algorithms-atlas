// =============================================================================
// Fast Search（块二分）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FastSearchHooks {
  /** 块切分完成，给出块首元素与其下标区间。 */
  onBlocks?: (blockFirsts: number[], blockSize: number) => void;
  /** 第一阶段：在块摘要上比较，候选块下标 b。 */
  onBlockProbe?: (b: number, first: number) => void;
  /** 已定位到候选块 [blockLo, blockHi)。 */
  onBlockLocated?: (blockLo: number, blockHi: number) => void;
  /** 第二阶段：块内二分比较 mid。 */
  onInBlockProbe?: (mid: number, v: number) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * Fast Search（块二分）：在**升序**数组中查找 target。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 * @returns 命中下标；不存在返回 -1
 */
export function fastSearch(
  arr: readonly number[],
  target: number,
  hooks: FastSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  const b = Math.max(1, Math.floor(Math.sqrt(n)));
  // 块首元素及其下标
  const blockFirsts: number[] = [];
  const blockStarts: number[] = [];
  for (let i = 0; i < n; i += b) {
    blockFirsts.push(arr[i]!);
    blockStarts.push(i);
  }
  hooks.onBlocks?.(blockFirsts, b);

  // 阶段一：在 blockFirsts 上二分找「最后一个 first <= target」的块
  let blo = 0;
  let bhi = blockFirsts.length - 1;
  let chosen = 0;
  while (blo <= bhi) {
    const mid = (blo + bhi) >> 1;
    hooks.onBlockProbe?.(mid, blockFirsts[mid]!);
    if (blockFirsts[mid]! <= target) {
      chosen = mid;
      blo = mid + 1;
    } else {
      bhi = mid - 1;
    }
  }
  const blockLo = blockStarts[chosen]!;
  const blockHi = Math.min(n, blockLo + b);
  hooks.onBlockLocated?.(blockLo, blockHi);

  // 阶段二：块内二分
  let lo = blockLo;
  let hi = blockHi - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid]!;
    hooks.onInBlockProbe?.(mid, v);
    if (v === target) {
      hooks.onDone?.(mid);
      return mid;
    }
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  hooks.onDone?.(-1);
  return -1;
}
