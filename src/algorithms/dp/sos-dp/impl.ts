// =============================================================================
// 高维前缀和DP（Sum Over Subsets, SOS DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 对每个掩码 mask，求其所有子集 sub 的权值之和：
//   f[mask] = Σ_{sub ⊆ mask} a[sub]
// 逐位推进：f[mask] += f[mask ^ (1<<i)]（当 mask 含第 i 位）。O(n * 2^n)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SosDpHooks {
  /** 第 i 位迭代开始。 */
  onBit?: (i: number) => void;
  /** 把 mask 去掉第 i 位后的子集贡献累加到 f[mask]。 */
  onMerge?: (mask: number, from: number, val: number) => void;
  /** 完成 mask 的部分和（经过第 i 位后）。 */
  onUpdate?: (mask: number, val: number) => void;
}

/**
 * 高维前缀和（SOS DP）：对每个掩码 `mask`，求其所有子集 `sub ⊆ mask` 的 `a[sub]` 之和。
 *
 * 状态：`f[mask]` = Σ_{sub ⊆ mask} a[sub]。
 * 转移（逐位）：对每一位 i，若 mask 含该位，则 `f[mask] += f[mask \ {i}]`。
 *
 * @param a 长度为 2^n 的权值数组（下标即掩码）
 * @param hooks 可选事件钩子
 * @returns f 数组：每个掩码的子集和。
 */
export function sosDp(a: readonly number[], hooks: SosDpHooks = {}): number[] {
  const size = a.length;
  if (size === 0) return [];
  const n = Math.log2(size);
  // 确保 size 是 2 的幂
  const f = [...a];
  for (let i = 0; i < n; i++) {
    hooks.onBit?.(i);
    for (let mask = 0; mask < size; mask++) {
      if (mask & (1 << i)) {
        const from = mask ^ (1 << i);
        f[mask]! += f[from]!;
        hooks.onMerge?.(mask, from, f[mask]!);
        hooks.onUpdate?.(mask, f[mask]!);
      }
    }
  }
  return f;
}
