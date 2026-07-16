// =============================================================================
// 分块 Sqrt Decomposition · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SqrtDecompositionHooks {
  /** 构建第 b 个块的预聚合（块内元素和）。 */
  onBlockBuild?: (b: number, sum: number) => void;
  /** 查询时扫描「散段」下标 i。 */
  onScanElement?: (i: number) => void;
  /** 查询时使用「整块」b 的预聚合。 */
  onUseBlock?: (b: number, sum: number) => void;
  /** 区间查询结果。 */
  onQuery?: (lo: number, hi: number, sum: number) => void;
}

/**
 * 分块（√n 分解）：支持 `O(1)` 点更新、`O(√n)` 区间求和。
 *
 * 原理：把长度 `n` 的数组按块大小 `B = ⌈√n⌉` 切成约 `√n` 个块，每块预聚合（这里为求和）。
 * 区间查询 `[lo, hi]`：\n- 两端不满一块的「散段」逐元素累加\n- 中间的「整块」直接用预聚合\n\n- 构建 `O(n)`，点更新 `O(1)`，区间查询 `O(√n)`\n- 空间 `O(n)`（数组 + 块聚合）
 *
 * @param arr 原数组（克隆后操作）
 * @param hooks 可选的事件钩子
 * @returns 一个支持 `query(lo, hi)` 与 `update(i, v)` 的对象
 */
export function sqrtDecomposition(
  arr: readonly number[],
  hooks: SqrtDecompositionHooks = {},
): {
  query: (lo: number, hi: number) => number;
  update: (i: number, v: number) => void;
} {
  const a = [...arr];
  const n = a.length;
  const B = Math.max(1, Math.ceil(Math.sqrt(n)));
  const blockCount = Math.ceil(n / B);
  // block[b] = 第 b 块元素之和
  const block = new Array<number>(blockCount).fill(0);
  for (let i = 0; i < n; i++) {
    block[Math.floor(i / B)]! += a[i]!;
  }
  for (let b = 0; b < blockCount; b++) hooks.onBlockBuild?.(b, block[b]!);

  const query = (lo: number, hi: number): number => {
    if (lo < 0) lo = 0;
    if (hi >= n) hi = n - 1;
    if (lo > hi) return 0;
    let sum = 0;
    const bl = Math.floor(lo / B);
    const br = Math.floor(hi / B);
    if (bl === br) {
      for (let i = lo; i <= hi; i++) {
        hooks.onScanElement?.(i);
        sum += a[i]!;
      }
    } else {
      // 左散段
      for (let i = lo; i < (bl + 1) * B; i++) {
        hooks.onScanElement?.(i);
        sum += a[i]!;
      }
      // 中间整块
      for (let b = bl + 1; b < br; b++) {
        hooks.onUseBlock?.(b, block[b]!);
        sum += block[b]!;
      }
      // 右散段
      for (let i = br * B; i <= hi; i++) {
        hooks.onScanElement?.(i);
        sum += a[i]!;
      }
    }
    hooks.onQuery?.(lo, hi, sum);
    return sum;
  };

  const update = (i: number, v: number): void => {
    const b = Math.floor(i / B);
    block[b]! += v - a[i]!;
    a[i] = v;
  };

  return { query, update };
}
