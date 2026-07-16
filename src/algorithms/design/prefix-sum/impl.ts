// =============================================================================
// 前缀和（Prefix Sum）· 纯算法实现
// 零 DOM 依赖，可独立单测。构建 prefix 数组后 O(1) 区间求和。
// 通过「钩子」暴露构建与查询过程，供录制器使用。
// =============================================================================

/** 构建过程中的事件钩子。任一可选。 */
export interface PrefixSumHooks {
  /** 构建：已计算 prefix[i+1] = sum(a[0..i])。给出下标 i 与累计和 sum。 */
  onBuild?: (i: number, sum: number) => void;
  /** 查询：区间 [l, r] 的和已求出。给出 l、r、result。 */
  onQuery?: (l: number, r: number, result: number) => void;
}

/**
 * 前缀和数据结构。
 *
 * prefix[i] = sum(a[0..i-1])，prefix[0] = 0。
 * rangeSum(l, r) = prefix[r+1] - prefix[l]。
 *
 * 构建 O(n)，单次查询 O(1)。
 */
export class PrefixSum {
  readonly prefix: number[];
  readonly n: number;

  constructor(arr: readonly number[], hooks: PrefixSumHooks = {}) {
    this.n = arr.length;
    this.prefix = new Array<number>(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.prefix[i + 1] = this.prefix[i]! + arr[i]!;
      hooks.onBuild?.(i, this.prefix[i + 1]!);
    }
  }

  /** 区间 [l, r]（左闭右闭）的和。l<=r 且 0<=l<=r<n。 */
  rangeSum(l: number, r: number, hooks?: PrefixSumHooks): number {
    if (l < 0 || r >= this.n || l > r) {
      throw new RangeError(`非法区间 [${l}, ${r}]，有效范围 [0, ${this.n - 1}]`);
    }
    const result = this.prefix[r + 1]! - this.prefix[l]!;
    hooks?.onQuery?.(l, r, result);
    return result;
  }
}

/** 便捷：一次调用完成构建 + 单次查询。 */
export function prefixSum(arr: readonly number[], l: number, r: number): number {
  return new PrefixSum(arr).rangeSum(l, r);
}
