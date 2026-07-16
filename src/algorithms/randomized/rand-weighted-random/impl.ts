// 加权随机选择 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export class WeightedRandom {
  public readonly cumsum: number[];
  public readonly total: number;

  constructor(public readonly weights: number[]) {
    if (weights.some((w) => w < 0)) throw new Error('权重不能为负');
    if (weights.length === 0) throw new Error('权重为空');
    let acc = 0;
    this.cumsum = weights.map((w) => (acc += w));
    this.total = acc;
  }

  /** 按权重抽取一个索引。 */
  pick(rng: Rng): number {
    if (this.total === 0) return Math.floor(rng() * this.weights.length);
    const r = rng() * this.total;
    // 二分找首个 cumsum > r
    let lo = 0;
    let hi = this.cumsum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.cumsum[mid]! <= r) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  sample(count: number, rng: Rng): number[] {
    const out: number[] = [];
    for (let i = 0; i < count; i++) out.push(this.pick(rng));
    return out;
  }
}

export function weightedRandom(weights: number[], count: number, rng: Rng): number[] {
  return new WeightedRandom(weights).sample(count, rng);
}
