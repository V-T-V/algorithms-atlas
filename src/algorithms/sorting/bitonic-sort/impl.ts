// =============================================================================
// 双调排序 Bitonic Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BitonicSortHooks {
  /** 开始一次比较-交换（dir = 1 升序，0 降序）。 */
  onCompare?: (i: number, j: number, dir: 0 | 1) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
}

/**
 * 双调排序（Bitonic Sort）。
 *
 * 原理：先递归把 `[lo, len)` 构造成一个**双调序列**（先升后降），再用
 * *Bitonic Merge* 把它整体合并成有序。所有比较-交换的方向由当前段的
 * 目标方向 `dir` 决定，因此比较模式**与数据无关**，适合并行硬件。
 *
 * 标准实现要求 `len` 是 2 的幂；当输入长度不是 2 的幂时，本实现会把它
 * pad 到下一个 2 的幂（用 `+∞` 即 `Infinity`），排序后剔除填充元素。
 *
 * - 时间 `O(n log²n)`
 * - 空间 `O(n)`（克隆 + 填充）
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function bitonicSort(arr: readonly number[], hooks: BitonicSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // pad 到 2 的幂，用 Infinity 作为哨兵（排序后必在末尾）
  let len = 1;
  while (len < n) len <<= 1;
  for (let k = n; k < len; k++) a.push(Infinity);

  const cmpSwap = (i: number, j: number, dir: 0 | 1): void => {
    hooks.onCompare?.(i, j, dir);
    const shouldSwap = dir === 1 ? a[i]! > a[j]! : a[i]! < a[j]!;
    if (shouldSwap) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
      hooks.onSwap?.(i, j);
    }
  };

  // 把 [lo, lo+len) 合并成方向 dir（1 升, 0 降）的单调段
  const bitonicMerge = (lo: number, l: number, dir: 0 | 1): void => {
    if (l <= 1) return;
    const m = l >> 1;
    for (let i = lo; i < lo + m; i++) cmpSwap(i, i + m, dir);
    bitonicMerge(lo, m, dir);
    bitonicMerge(lo + m, m, dir);
  };

  // 递归：先构造双调序列，再整体合并成升序（dir=1）
  const sort = (lo: number, l: number, dir: 0 | 1): void => {
    if (l <= 1) return;
    const m = l >> 1;
    sort(lo, m, 1); // 前半升序
    sort(lo + m, m, 0); // 后半降序 → 整体成双调
    bitonicMerge(lo, l, dir);
  };

  sort(0, len, 1);
  a.length = n; // 剔除填充
  return a;
}
