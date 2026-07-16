// =============================================================================
// 数组分块（块状数组）· 纯算法实现
// =============================================================================

export interface BlockHooks {
  onBuildBlock?: (blockId: number, sum: number) => void;
  onQueryFullBlock?: (blockId: number, sum: number) => void;
  onQueryPartial?: (idx: number, value: number) => void;
  onUpdate?: (idx: number, oldValue: number, newValue: number, blockId: number) => void;
}

export class BlockArray {
  data: number[];
  blockSum: number[];
  blockSize: number;
  blockCount: number;
  private hooks: BlockHooks;

  constructor(arr: number[], hooks: BlockHooks = {}) {
    this.data = arr.slice();
    this.hooks = hooks;
    const n = arr.length;
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
    this.blockCount = Math.ceil(n / this.blockSize);
    this.blockSum = new Array<number>(this.blockCount).fill(0);
    for (let i = 0; i < n; i++) {
      const b = this.blockIdOf(i);
      this.blockSum[b]! += arr[i]!;
    }
    for (let b = 0; b < this.blockCount; b++) this.hooks.onBuildBlock?.(b, this.blockSum[b]!);
  }

  blockIdOf(idx: number): number {
    return Math.floor(idx / this.blockSize);
  }

  /** 区间求和 [l, r]（含两端）。 */
  rangeSum(l: number, r: number): number {
    if (l < 0) l = 0;
    if (r >= this.data.length) r = this.data.length - 1;
    if (l > r) return 0;
    let ans = 0;
    const bl = this.blockIdOf(l);
    const br = this.blockIdOf(r);
    if (bl === br) {
      for (let i = l; i <= r; i++) {
        ans += this.data[i]!;
        this.hooks.onQueryPartial?.(i, this.data[i]!);
      }
      return ans;
    }
    // 左端零散
    const leftEnd = (bl + 1) * this.blockSize - 1;
    for (let i = l; i <= leftEnd; i++) {
      ans += this.data[i]!;
      this.hooks.onQueryPartial?.(i, this.data[i]!);
    }
    // 整块
    for (let b = bl + 1; b < br; b++) {
      ans += this.blockSum[b]!;
      this.hooks.onQueryFullBlock?.(b, this.blockSum[b]!);
    }
    // 右端零散
    const rightStart = br * this.blockSize;
    for (let i = rightStart; i <= r; i++) {
      ans += this.data[i]!;
      this.hooks.onQueryPartial?.(i, this.data[i]!);
    }
    return ans;
  }

  /** 单点修改：把下标 idx 的值改为 value。 */
  update(idx: number, value: number): void {
    const b = this.blockIdOf(idx);
    const old = this.data[idx]!;
    this.blockSum[b]! += value - old;
    this.data[idx] = value;
    this.hooks.onUpdate?.(idx, old, value, b);
  }

  /** 单点加 delta。 */
  add(idx: number, delta: number): void {
    this.update(idx, this.data[idx]! + delta);
  }
}
