// =============================================================================
// 小波树（支持区间第 k 小）
// =============================================================================

export interface WaveletTreeHooks {
  onQuery?: (l: number, r: number, k: number, result: number) => void;
}

interface WTNode {
  lo: number; // 值域下界（实数值）
  hi: number; // 值域上界
  // B[i] = (第 i 个元素是否 > mid)；prefix[i] = B[0..i-1] 中 1 的个数
  prefix: number[];
  // onesPrefix[i] = 前 i 个里 1 的个数 = prefix[i]
  // zerosPrefix[i] = 前 i 个里 0 的个数 = i - prefix[i]
  left: WTNode | null;
  right: WTNode | null;
}

export class WaveletTree {
  root: WTNode | null;
  hooks: WaveletTreeHooks;

  constructor(arr: number[], hooks: WaveletTreeHooks = {}) {
    this.hooks = hooks;
    if (arr.length === 0) {
      this.root = null;
      return;
    }
    const lo = Math.min(...arr);
    const hi = Math.max(...arr);
    this.root = this.build(arr, lo, hi);
  }

  private build(arr: number[], lo: number, hi: number): WTNode {
    if (lo === hi) {
      const prefix = new Array<number>(arr.length + 1).fill(0);
      // 所有值都相等，记 0（其实无所谓，因为不再分裂）
      return { lo, hi, prefix, left: null, right: null };
    }
    const mid = (lo + hi) >> 1;
    const prefix = new Array<number>(arr.length + 1).fill(0);
    const leftArr: number[] = [];
    const rightArr: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      const bit = arr[i]! > mid ? 1 : 0;
      prefix[i + 1] = prefix[i]! + bit;
      if (bit === 0) leftArr.push(arr[i]!);
      else rightArr.push(arr[i]!);
    }
    const left = leftArr.length > 0 ? this.build(leftArr, lo, mid) : null;
    const right = rightArr.length > 0 ? this.build(rightArr, mid + 1, hi) : null;
    return { lo, hi, prefix, left, right };
  }

  /** 区间 [l..r] (0-indexed 闭区间) 内第 k 小（k 从 1 开始） */
  kth(l: number, r: number, k: number): number {
    // 使用半开区间 [l, r+1) 内部递归
    const result = this.kthRec(this.root, l, r + 1, k);
    this.hooks.onQuery?.(l, r, k, result);
    return result;
  }

  // 半开区间 [l, r) 内第 k 小
  private kthRec(node: WTNode | null, l: number, r: number, k: number): number {
    if (!node) return NaN;
    if (node.lo === node.hi) return node.lo;
    // 半开区间 [l, r) 内 0 的个数 = (r - l) - (prefix[r] - prefix[l])
    const zerosIn = r - l - (node.prefix[r]! - node.prefix[l]!);
    if (k <= zerosIn) {
      // 走左：newL = l - prefix[l], newR = r - prefix[r]
      return this.kthRec(node.left, l - node.prefix[l]!, r - node.prefix[r]!, k);
    } else {
      // 走右：newL = prefix[l], newR = prefix[r]
      return this.kthRec(node.right, node.prefix[l]!, node.prefix[r]!, k - zerosIn);
    }
  }

  /** 区间 [l..r] (闭区间) 内 value 的出现次数 */
  rank(l: number, r: number, value: number): number {
    return this.rankRec(this.root, l, r + 1, value);
  }

  // 半开区间 [l, r) 内 value 的出现次数
  private rankRec(node: WTNode | null, l: number, r: number, value: number): number {
    if (!node || r <= l) return 0;
    if (node.lo === node.hi) return node.lo === value ? r - l : 0;
    const mid = (node.lo + node.hi) >> 1;
    if (value <= mid) {
      return this.rankRec(node.left, l - node.prefix[l]!, r - node.prefix[r]!, value);
    } else {
      return this.rankRec(node.right, node.prefix[l]!, node.prefix[r]!, value);
    }
  }
}
