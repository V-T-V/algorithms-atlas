// =============================================================================
// 分块数组：区间加 + 区间求和（√n 分块）
// =============================================================================

import { Math_floorSqrt } from './math-helpers.ts';

export interface BlockHooks {
  onBlockUpdate?: (b: number, add: number) => void;
  onPartialUpdate?: (l: number, r: number) => void;
  onQuery?: (l: number, r: number, result: number) => void;
}

export class BlockList2 {
  private blocks: number[][] = [];
  private blockSum: number[] = [];
  private lazy: number[] = [];
  private bs: number;
  private bn: number;
  private n: number;
  constructor(
    init: number[],
    private hooks: BlockHooks = {},
  ) {
    this.n = init.length;
    this.bs = Math.max(1, Math_floorSqrt(this.n));
    this.bn = Math.ceil(this.n / this.bs);
    for (let b = 0; b < this.bn; b++) {
      const start = b * this.bs;
      const end = Math.min(this.n, start + this.bs);
      const arr: number[] = [];
      for (let i = start; i < end; i++) arr.push(init[i]!);
      this.blocks.push(arr);
      this.blockSum.push(arr.reduce((a, x) => a + x, 0));
      this.lazy.push(0);
    }
  }
  update(ql: number, qr: number, add: number): void {
    const bl = Math.floor(ql / this.bs);
    const br = Math.floor(qr / this.bs);
    if (bl === br) {
      // 同块暴力
      for (let i = ql; i <= qr; i++) {
        this.blocks[bl]![i - bl * this.bs]! += add;
        this.blockSum[bl]! += add;
      }
      this.hooks.onPartialUpdate?.(ql, qr);
      return;
    }
    // 左散块
    const leftEnd = (bl + 1) * this.bs - 1;
    for (let i = ql; i <= leftEnd && i < this.n; i++) {
      this.blocks[bl]![i - bl * this.bs]! += add;
      this.blockSum[bl]! += add;
    }
    this.hooks.onPartialUpdate?.(ql, leftEnd);
    // 中间整块
    for (let b = bl + 1; b < br; b++) {
      this.lazy[b]! += add;
      this.hooks.onBlockUpdate?.(b, add);
    }
    // 右散块
    const rightStart = br * this.bs;
    for (let i = rightStart; i <= qr; i++) {
      this.blocks[br]![i - br * this.bs]! += add;
      this.blockSum[br]! += add;
    }
    this.hooks.onPartialUpdate?.(rightStart, qr);
  }
  query(ql: number, qr: number): number {
    const bl = Math.floor(ql / this.bs);
    const br = Math.floor(qr / this.bs);
    let res = 0;
    if (bl === br) {
      for (let i = ql; i <= qr; i++) res += this.blocks[bl]![i - bl * this.bs]! + this.lazy[bl]!;
      this.hooks.onQuery?.(ql, qr, res);
      return res;
    }
    const leftEnd = (bl + 1) * this.bs - 1;
    for (let i = ql; i <= leftEnd && i < this.n; i++)
      res += this.blocks[bl]![i - bl * this.bs]! + this.lazy[bl]!;
    for (let b = bl + 1; b < br; b++) {
      res += this.blockSum[b]! + this.lazy[b]! * this.blocks[b]!.length;
    }
    const rightStart = br * this.bs;
    for (let i = rightStart; i <= qr; i++)
      res += this.blocks[br]![i - br * this.bs]! + this.lazy[br]!;
    this.hooks.onQuery?.(ql, qr, res);
    return res;
  }
  snapshot(): number[] {
    const out: number[] = [];
    for (let b = 0; b < this.bn; b++) {
      for (let i = 0; i < this.blocks[b]!.length; i++)
        out.push(this.blocks[b]![i]! + this.lazy[b]!);
    }
    return out;
  }
  get blockSize(): number {
    return this.bs;
  }
  get blockCount(): number {
    return this.bn;
  }
}
