// =============================================================================
// 别名法（Alias Method / Vose 法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露建表与采样过程，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 建表过程的事件钩子。 */
export interface AliasBuildHooks {
  /** 每配对一次（小桶 small 接收大桶 large 的别名）触发。 */
  onBuild?: (small: number, large: number) => void;
}

/** 别名表。建好后可 O(1) 反复采样。 */
export class AliasTable {
  /** 概率阈值数组：prob[i] ∈ [0,1]，表示采样 i 时取「自身」的概率。 */
  readonly prob: number[];
  /** 别名数组：采样 i 时若不取自身，则取 alias[i]。 */
  readonly alias: number[];
  readonly size: number;

  constructor(probs: readonly number[], hooks: AliasBuildHooks = {}) {
    const n = probs.length;
    if (n === 0) throw new Error('概率数组为空 / empty probability array');

    // 归一化并校验
    const sum = probs.reduce((a, b) => a + b, 0);
    if (!(sum > 0)) throw new Error('概率和必须为正 / sum of probabilities must be positive');
    const p = probs.map((x) => (x * n) / sum); // 缩放到均值 1

    this.prob = new Array<number>(n).fill(0);
    this.alias = new Array<number>(n).fill(-1);
    this.size = n;

    const small: number[] = [];
    const large: number[] = [];
    for (let i = 0; i < n; i++) {
      if (p[i]! < 1) small.push(i);
      else large.push(i);
    }

    while (small.length > 0 && large.length > 0) {
      const s = small.pop()!;
      const l = large.pop()!;
      this.prob[s] = p[s]!;
      this.alias[s] = l;
      hooks.onBuild?.(s, l);
      // 大桶捐出 (1 - p[s]) 给小桶后，剩余 = p[l] - (1 - p[s])
      p[l] = p[l]! + p[s]! - 1;
      if (p[l]! < 1) small.push(l);
      else large.push(l);
    }

    // 剩余的大桶（浮点误差导致 p≈1）置 1
    while (large.length > 0) {
      this.prob[large.pop()!] = 1;
    }
    // small 理论上已空（浮点误差残留），置 1 兜底
    while (small.length > 0) {
      this.prob[small.pop()!] = 1;
    }
  }

  /**
   * 按分布采样一个下标。
   *
   * @param rng [0,1) 随机源，默认 Math.random
   * @returns 采样到的下标 ∈ [0, n)
   */
  sample(rng: Rng = Math.random): number {
    const i = Math.floor(rng() * this.size); // 桶
    if (i < 0 || i >= this.size) return 0;
    return rng() < this.prob[i]! ? i : this.alias[i]! < 0 ? i : this.alias[i]!;
  }

  /** 采样 n 次并统计频率。用于校验分布正确性。 */
  sampleCounts(n: number, rng: Rng = Math.random): number[] {
    const counts = new Array<number>(this.size).fill(0);
    for (let k = 0; k < n; k++) counts[this.sample(rng)]!++;
    return counts;
  }
}
