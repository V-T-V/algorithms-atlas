// =============================================================================
// 差分数组（Difference Array）· 纯算法实现
// 零 DOM 依赖，可独立单测。O(1) 区间加，O(n) 还原。前缀和的逆运算。
// 通过「钩子」暴露每次更新与最终还原，供录制器使用。
// =============================================================================

/** 一次区间更新操作。 */
export interface DiffUpdate {
  /** 左端点（含）。 */
  l: number;
  /** 右端点（含）。 */
  r: number;
  /** 每个元素增加的值（可为负）。 */
  val: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DifferenceArrayHooks {
  /** 完成一次区间加：a[l..r] += val。给出更新后的差分数组。 */
  onUpdate?: (l: number, r: number, val: number, diff: number[]) => void;
  /** 还原完成：给出还原后的原数组。 */
  onRestore?: (arr: number[]) => void;
}

/**
 * 差分数组数据结构。
 *
 * 内部维护差分数组 `diff[0..n]`（长度 n+1，diff[n] 用于吸收 r+1==n 的更新）。
 * - `update(l, r, val)`：diff[l] += val; diff[r+1] -= val。
 * - `restore()`：对 diff 求前缀和，得更新后的原数组（长度 n）。
 *
 * 区间更新 O(1)，还原 O(n)。
 */
export class DifferenceArray {
  readonly n: number;
  readonly diff: number[];

  constructor(n: number) {
    this.n = Math.max(0, Math.floor(n));
    // diff 长度 n+1，使 r+1 == n 时 diff[r+1] 仍合法
    this.diff = new Array<number>(this.n + 1).fill(0);
  }

  /** 区间加：a[l..r] += val。要求 0 <= l <= r < n。 */
  update(l: number, r: number, val: number, hooks?: DifferenceArrayHooks): void {
    if (l < 0 || r >= this.n || l > r) {
      throw new RangeError(`非法区间 [${l}, ${r}]，有效范围 [0, ${this.n - 1}]`);
    }
    this.diff[l]! += val;
    this.diff[r + 1]! -= val;
    hooks?.onUpdate?.(l, r, val, [...this.diff]);
  }

  /** 还原：对 diff 求前缀和，得更新后的原数组（长度 n）。 */
  restore(hooks?: DifferenceArrayHooks): number[] {
    const arr: number[] = new Array<number>(this.n).fill(0);
    let acc = 0;
    for (let i = 0; i < this.n; i++) {
      acc += this.diff[i]!;
      arr[i] = acc;
    }
    hooks?.onRestore?.([...arr]);
    return arr;
  }
}

/**
 * 便捷：给定初始长度与一组更新，应用后还原。
 *
 * @param n 原数组长度
 * @param updates 区间更新列表
 * @param hooks 可选事件钩子
 * @returns 还原后的原数组
 */
export function differenceArray(
  n: number,
  updates: DiffUpdate[],
  hooks: DifferenceArrayHooks = {},
): number[] {
  const da = new DifferenceArray(n);
  for (const u of updates) da.update(u.l, u.r, u.val, hooks);
  return da.restore(hooks);
}
