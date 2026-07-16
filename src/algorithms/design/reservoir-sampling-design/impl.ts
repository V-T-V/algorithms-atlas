// 蓄水池抽样 · 纯算法实现
// 使用线性同余发生器（LCG）提供可复现的伪随机数。

/** 线性同余发生器（与 quickselect-randomized 一致），可复现。 */
export class StreamLCG {
  private state: number;
  constructor(seed = 1) {
    this.state = seed >>> 0;
  }
  /** 返回 [0, 2^32) 内的伪随机整数。 */
  nextUint32(): number {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state;
  }
  /** 返回 [0, n) 内的伪随机整数。 */
  nextInt(n: number): number {
    return this.nextUint32() % n;
  }
}

/** 事件钩子。 */
export interface ReservoirHooks {
  /** 第 i 个元素（0-based）进入蓄水池（i < k）。 */
  onFill?: (i: number, value: number) => void;
  /** 第 i 个元素以 k/i 概率被保留，替换池中位置 slot。 */
  onConsider?: (i: number, value: number, kept: boolean, slot: number) => void;
  /** 流结束，给出最终蓄水池内容。 */
  onResult?: (reservoir: number[]) => void;
}

/**
 * 蓄水池抽样 R 算法：从流中等概率抽取 k 个样本。
 * @param stream 输入流（数组形态）
 * @param k 样本数
 * @param seed 随机种子
 * @param hooks 可选事件钩子
 * @returns 蓄水池（长度 min(k, n) 的样本数组）
 */
export function reservoirSampling(
  stream: readonly number[],
  k: number,
  seed = 1,
  hooks: ReservoirHooks = {},
): number[] {
  if (!Number.isInteger(k) || k <= 0) throw new RangeError('k must be a positive integer');
  const rng = new StreamLCG(seed);
  const reservoir: number[] = [];

  for (let i = 0; i < stream.length; i++) {
    const v = stream[i]!;
    if (i < k) {
      reservoir.push(v);
      hooks.onFill?.(i, v);
    } else {
      // 以 k/i 概率保留：取 j ∈ [0, i]，若 j < k 则替换位置 j
      const j = rng.nextInt(i + 1);
      const kept = j < k;
      if (kept) {
        reservoir[j] = v;
      }
      hooks.onConsider?.(i, v, kept, j < k ? j : -1);
    }
  }
  hooks.onResult?.([...reservoir]);
  return reservoir;
}
