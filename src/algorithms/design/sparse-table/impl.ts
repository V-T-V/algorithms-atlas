// =============================================================================
// 稀疏表（Sparse Table）· 纯算法实现
// 零 DOM 依赖，可独立单测。预处理 O(n log n)，查询 O(1) 静态区间最小值（RMQ）。
// 通过「钩子」暴露构建过程，供录制器使用。
// =============================================================================

/** 构建过程中的事件钩子。任一可选。 */
export interface SparseTableHooks {
  /** 完成第 k 层的构建。给出层数 k 与该层 st[k]。 */
  onBuild?: (k: number, level: number[]) => void;
}

/**
 * 稀疏表数据结构（区间最小值版）。
 *
 * - st[k][i] = min(a[i..i+2^k-1])
 * - 查询 [l, r]：k = ⌊log2(len)⌋，min(st[k][l], st[k][r-2^k+1])
 *
 * 预处理 O(n log n)，单次查询 O(1)。仅支持 min（idempotent）。
 */
export class SparseTable {
  readonly n: number;
  readonly st: number[][];
  readonly log: number[];

  constructor(arr: readonly number[], hooks: SparseTableHooks = {}) {
    this.n = arr.length;
    // 预处理 log2 表：log[i] = ⌊log2 i⌋
    this.log = new Array<number>(Math.max(this.n + 1, 1)).fill(0);
    for (let i = 2; i <= this.n; i++) this.log[i] = this.log[i >> 1]! + 1;

    const K = this.n > 0 ? this.log[this.n]! + 1 : 0;
    // 每层有效长度为 n - 2^k + 1（k 层区间长 2^k）；不足时该层为空
    this.st = Array.from({ length: K }, (_, k) => {
      const len = this.n - (1 << k) + 1;
      return new Array<number>(Math.max(0, len)).fill(0);
    });
    // 第 0 层
    if (K > 0) {
      for (let i = 0; i < this.n; i++) this.st[0]![i] = arr[i]!;
      hooks.onBuild?.(0, [...this.st[0]!]);
    }
    // 第 k 层
    for (let k = 1; k < K; k++) {
      const step = 1 << (k - 1);
      for (let i = 0; i + (1 << k) - 1 < this.n; i++) {
        this.st[k]![i] = Math.min(this.st[k - 1]![i]!, this.st[k - 1]![i + step]!);
      }
      hooks.onBuild?.(k, [...this.st[k]!]);
    }
  }

  /** 区间 [l, r]（左闭右闭）的最小值。0 <= l <= r < n。 */
  query(l: number, r: number): number {
    if (this.n === 0 || l < 0 || r >= this.n || l > r) {
      throw new RangeError(`非法区间 [${l}, ${r}]，有效范围 [0, ${this.n - 1}]`);
    }
    const k = this.log[r - l + 1]!;
    return Math.min(this.st[k]![l]!, this.st[k]![r - (1 << k) + 1]!);
  }
}

/** 便捷：一次调用完成预处理 + 单次查询。 */
export function sparseTable(arr: readonly number[], l: number, r: number): number {
  return new SparseTable(arr).query(l, r);
}
