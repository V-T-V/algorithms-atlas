// 双堆第 k（动态中位数）· 实现

/** 简化：用数组模拟堆，插入时排序保持有序，便于教学演示。 */
export class TwoHeapMedian {
  private lo: number[] = []; // 大顶（较小一半），降序
  private hi: number[] = []; // 小顶（较大一半），升序

  insert(v: number): void {
    // 先放 lo
    this.lo.push(v);
    this.lo.sort((a, b) => b - a);
    // 把 lo 最大挪到 hi
    this.hi.push(this.lo.shift()!);
    this.hi.sort((a, b) => a - b);
    // 平衡：lo 数量 >= hi
    if (this.lo.length < this.hi.length) {
      this.lo.push(this.hi.shift()!);
      this.lo.sort((a, b) => b - a);
    }
  }

  median(): number {
    if (this.lo.length === 0) throw new Error('空');
    if (this.lo.length > this.hi.length) return this.lo[0]!;
    return (this.lo[0]! + this.hi[0]!) / 2;
  }

  get lower(): number[] {
    return [...this.lo].sort((a, b) => a - b);
  }
  get upper(): number[] {
    return [...this.hi];
  }
  get size(): number {
    return this.lo.length + this.hi.length;
  }
}

export interface ThStep {
  value: number;
  median: number;
  lo: number[];
  hi: number[];
}

/** 流式插入 nums，返回每步中位数。 */
export function runningMedian(nums: number[]): number[] {
  const th = new TwoHeapMedian();
  const out: number[] = [];
  for (const v of nums) {
    th.insert(v);
    out.push(th.median());
  }
  return out;
}

export function runningMedianSteps(nums: number[]): ThStep[] {
  const th = new TwoHeapMedian();
  const steps: ThStep[] = [];
  for (const v of nums) {
    th.insert(v);
    steps.push({ value: v, median: th.median(), lo: [...th.lower], hi: [...th.upper] });
  }
  return steps;
}
