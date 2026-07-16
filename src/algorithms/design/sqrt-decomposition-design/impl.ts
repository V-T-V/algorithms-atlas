// 分块（√n 分解）· 纯算法实现
// 支持区间求和 + 单点更新。

/** 事件钩子。 */
export interface SqrtDecompHooks {
  /** 建块完成：块大小 blockSize，块数 numBlocks。 */
  onBuilt?: (blockSize: number, numBlocks: number, blockSums: number[]) => void;
  /** 区间查询：访问某完整块 b。 */
  onQueryBlock?: (b: number, blockSum: number) => void;
  /** 区间查询：枚举零散下标 i。 */
  onQueryIndex?: (i: number) => void;
  /** 单点更新 i：旧值 oldV → 新值 newV，所在块 b 重算。 */
  onUpdate?: (i: number, oldV: number, newV: number, b: number) => void;
}

/**
 * 分块结构：维护区间和与单点更新。
 */
export class SqrtDecomposition {
  private readonly a: number[];
  private readonly blockSum: number[];
  readonly blockSize: number;
  readonly numBlocks: number;

  constructor(
    arr: readonly number[],
    private hooks: SqrtDecompHooks = {},
  ) {
    this.a = [...arr];
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(this.a.length)));
    this.numBlocks = Math.ceil(this.a.length / this.blockSize);
    this.blockSum = new Array<number>(this.numBlocks).fill(0);
    for (let i = 0; i < this.a.length; i++) {
      this.blockSum[this.blockOf(i)]! += this.a[i]!;
    }
    this.hooks.onBuilt?.(this.blockSize, this.numBlocks, [...this.blockSum]);
  }

  /** 下标 i 所属块。 */
  blockOf(i: number): number {
    return Math.floor(i / this.blockSize);
  }

  /** 区间 [l, r] 求和（含两端）。 */
  rangeSum(l: number, r: number): number {
    if (l < 0 || r >= this.a.length || l > r) throw new RangeError(`bad range [${l}, ${r}]`);
    let sum = 0;
    const bl = this.blockOf(l);
    const br = this.blockOf(r);
    if (bl === br) {
      // 同一块：暴力
      for (let i = l; i <= r; i++) {
        sum += this.a[i]!;
        this.hooks.onQueryIndex?.(i);
      }
      return sum;
    }
    // 左残段
    const leftEnd = (bl + 1) * this.blockSize - 1;
    for (let i = l; i <= leftEnd; i++) {
      sum += this.a[i]!;
      this.hooks.onQueryIndex?.(i);
    }
    // 中间整块
    for (let b = bl + 1; b < br; b++) {
      sum += this.blockSum[b]!;
      this.hooks.onQueryBlock?.(b, this.blockSum[b]!);
    }
    // 右残段
    const rightStart = br * this.blockSize;
    for (let i = rightStart; i <= r; i++) {
      sum += this.a[i]!;
      this.hooks.onQueryIndex?.(i);
    }
    return sum;
  }

  /** 单点更新：a[i] = v。 */
  update(i: number, v: number): void {
    if (i < 0 || i >= this.a.length) throw new RangeError(`index out of range: ${i}`);
    const b = this.blockOf(i);
    const oldV = this.a[i]!;
    this.a[i] = v;
    // 重算该块
    let s = 0;
    const lo = b * this.blockSize;
    const hi = Math.min(this.a.length - 1, (b + 1) * this.blockSize - 1);
    for (let k = lo; k <= hi; k++) s += this.a[k]!;
    this.blockSum[b] = s;
    this.hooks.onUpdate?.(i, oldV, v, b);
  }

  /** 当前数组快照。 */
  snapshot(): number[] {
    return [...this.a];
  }
}
