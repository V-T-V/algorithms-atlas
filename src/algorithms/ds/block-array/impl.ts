// =============================================================================
// 分块数组 Block Array · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：sqrt(n) 分块。支持「区间加（懒标记）+ 单点查询」。
//   - 把长度 n 的数组按块大小 B ≈ √n 切成 ceil(n/B) 块
//   - addRange(l, r, v)：整块只更新块标记 blockTag，散块暴力加到元素
//   - query(i) = arr[i] + blockTag[blockOf(i)]
//   - 区间加 O(√n)、单点查 O(1)
// =============================================================================

/** 区间加 / 查询过程中的事件钩子。任一可选。 */
export interface BlockArrayHooks {
  /** 建块完成：共 blocks 块，每块大小 B。 */
  onBuild?: (n: number, blocks: number, blockSize: number) => void;
  /** 区间加开始：把 v 加到 [l, r]。 */
  onAddRangeStart?: (l: number, r: number, v: number) => void;
  /** 访问下标 i（散块暴力加）。block 表示是否整块。 */
  onVisit?: (i: number, block: boolean) => void;
  /** 给第 blockIdx 块打上懒标记 v。 */
  onBlockTag?: (blockIdx: number, v: number) => void;
  /** 查询下标 i 的当前值。 */
  onQuery?: (i: number, value: number) => void;
}

/**
 * 分块数组：区间加 + 单点查询。
 */
export class BlockArray {
  /** 原始元素数组。 */
  readonly arr: number[];
  /** 块大小 B ≈ √n。 */
  readonly blockSize: number;
  /** 块数。 */
  readonly blockCount: number;
  /** 每个块的懒标记（区间加的累加值）。 */
  readonly blockTag: number[];
  /** 下标 → 所属块号。 */
  readonly belong: number[];

  constructor(values: readonly number[] = [], hooks: BlockArrayHooks = {}) {
    this.arr = [...values];
    const n = this.arr.length;
    this.blockSize = Math.max(1, Math.floor(Math.sqrt(Math.max(1, n))));
    this.blockCount = Math.max(1, Math.ceil(n / this.blockSize));
    this.blockTag = new Array<number>(this.blockCount).fill(0);
    this.belong = new Array<number>(Math.max(1, n));
    for (let i = 0; i < n; i++) this.belong[i] = Math.floor(i / this.blockSize);
    hooks.onBuild?.(n, this.blockCount, this.blockSize);
  }

  /** 把 v 加到区间 [l, r]（闭区间）。 */
  addRange(l: number, r: number, v: number, hooks: BlockArrayHooks = {}): void {
    const n = this.arr.length;
    if (n === 0) return;
    const lo = Math.max(0, l);
    const hi = Math.min(n - 1, r);
    if (lo > hi) return;
    hooks.onAddRangeStart?.(lo, hi, v);

    const bl = this.belong[lo]!;
    const br = this.belong[hi]!;

    if (bl === br) {
      // 同一块：直接暴力
      for (let i = lo; i <= hi; i++) {
        this.arr[i]! += v;
        hooks.onVisit?.(i, false);
      }
      return;
    }

    // 左散块
    const leftEnd = (bl + 1) * this.blockSize - 1;
    for (let i = lo; i <= leftEnd; i++) {
      this.arr[i]! += v;
      hooks.onVisit?.(i, false);
    }
    // 右散块
    const rightStart = br * this.blockSize;
    for (let i = rightStart; i <= hi; i++) {
      this.arr[i]! += v;
      hooks.onVisit?.(i, false);
    }
    // 中间整块：只改懒标记
    for (let b = bl + 1; b < br; b++) {
      this.blockTag[b]! += v;
      hooks.onBlockTag?.(b, this.blockTag[b]!);
    }
  }

  /** 查询下标 i 的当前值。 */
  query(i: number, hooks: BlockArrayHooks = {}): number {
    const v = this.arr[i]! + this.blockTag[this.belong[i]!]!;
    hooks.onQuery?.(i, v);
    return v;
  }

  /** 当前所有元素值（元素 + 块标记）。 */
  toArray(): number[] {
    return this.arr.map((v, i) => v + this.blockTag[this.belong[i]!]!);
  }

  /** 每个块的起始下标列表（供可视化）。 */
  blockStarts(): number[] {
    const starts: number[] = [];
    for (let b = 0; b < this.blockCount; b++) starts.push(b * this.blockSize);
    return starts;
  }
}

/**
 * 便利函数：批量执行区间加操作，返回最终数组。
 * input = { values, ops: [{l, r, v}] }
 */
export function blockArray(
  input: { values: number[]; ops: Array<{ l: number; r: number; v: number }> },
  hooks: BlockArrayHooks = {},
): number[] {
  const ba = new BlockArray(input.values, hooks);
  for (const op of input.ops) ba.addRange(op.l, op.r, op.v, hooks);
  return ba.toArray();
}
