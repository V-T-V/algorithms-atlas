// =============================================================================
// 小波树：非负整数数组，支持区间第 k 小（基于二进制位分治）
// =============================================================================

export interface WaveletHooks {
  onLevel?: (bit: number, l: number, r: number) => void;
  onRange?: (lo: number, hi: number, value: number) => void;
  onDone?: (value: number) => void;
}

export class WaveletTree2 {
  private levels: { prefix: number[] }[] = [];
  private arr: number[];
  private maxVal: number;
  private bits: number;
  constructor(
    input: number[],
    private hooks: WaveletHooks = {},
  ) {
    this.arr = input.slice();
    this.maxVal = input.length === 0 ? 0 : Math.max(...input);
    this.bits = this.maxVal <= 0 ? 1 : Math.floor(Math.log2(this.maxVal)) + 1;
    this.build(input);
  }
  private build(input: number[]): void {
    let cur = input.slice();
    for (let b = this.bits - 1; b >= 0; b--) {
      const prefix: number[] = new Array(cur.length + 1).fill(0);
      const zeros: number[] = [];
      const ones: number[] = [];
      for (let i = 0; i < cur.length; i++) {
        const isZero = ((cur[i]! >> b) & 1) === 0;
        prefix[i + 1] = prefix[i]! + (isZero ? 1 : 0);
        if (isZero) zeros.push(cur[i]!);
        else ones.push(cur[i]!);
      }
      this.levels.unshift({ prefix });
      cur = zeros.concat(ones);
    }
  }
  /** 区间 [l, r]（0-indexed, 含）内第 k 小（k 从 1 开始）。 */
  kth(l: number, r: number, k: number): number {
    let lo = 0;
    let hi = this.maxVal;
    let cl = l;
    let cr = r;
    for (let i = 0; i < this.bits; i++) {
      const level = this.levels[i]!;
      const zeros = level.prefix[cr + 1]! - level.prefix[cl]!;
      const mid = (lo + hi) >> 1;
      const bit = this.bits - 1 - i;
      this.hooks.onLevel?.(bit, cl, cr);
      if (k <= zeros) {
        // 走左子（高位 0）
        cl = lo + (level.prefix[cl]! - level.prefix[lo]!);
        cr = cl + zeros - 1;
        hi = mid;
      } else {
        // 走右子
        k -= zeros;
        const leftTotal = level.prefix[cr + 1]!;
        const beforeLeft = level.prefix[cl]!;
        const newCl = cl - beforeLeft + leftTotal;
        const newCnt = cr - cl + 1 - zeros;
        cl = newCl;
        cr = cl + newCnt - 1;
        lo = mid + 1;
      }
      this.hooks.onRange?.(cl, cr, 0);
    }
    this.hooks.onDone?.(lo);
    return lo;
  }
  get length(): number {
    return this.arr.length;
  }
}
