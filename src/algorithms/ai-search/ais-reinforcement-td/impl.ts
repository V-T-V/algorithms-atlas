// TD(0) 策略评估 · 实现

/** 离散有限 MRP 域：状态集合 S、转移与奖励由策略采样给出。 */
export interface TdDomain {
  states: number[];
  /** 在策略 π 下从 s 采样一次动作：返回 (下一状态, 奖励, 是否终止)。 */
  step: (s: number, rng: () => number) => readonly [number, number, boolean];
  /** 采样一个起始状态。 */
  start: (rng: () => number) => number;
}

export interface TdHooks {
  onTransition?: (s: number, sNext: number, r: number, v: number) => void;
  onEpisode?: (ep: number, deltaSum: number) => void;
}

/** 单步 TD(0)：返回价值表 V。 */
export function tdZero(
  domain: TdDomain,
  opts: {
    gamma: number;
    alpha: number;
    episodes: number;
    maxSteps: number;
    rng: () => number;
    initV?: Float64Array;
    hooks?: TdHooks;
  },
): Float64Array {
  const { gamma, alpha, episodes, maxSteps, rng, hooks } = opts;
  const V = opts.initV
    ? new Float64Array(opts.initV)
    : new Float64Array(Math.max(...domain.states) + 1);
  for (let ep = 0; ep < episodes; ep++) {
    let s = domain.start(rng);
    let deltaSum = 0;
    for (let t = 0; t < maxSteps; t++) {
      const [sNext, r, done] = domain.step(s, rng);
      const target = r + (done ? 0 : gamma * V[sNext]!);
      const delta = target - V[s]!;
      V[s] = V[s]! + alpha * delta;
      deltaSum += Math.abs(delta);
      hooks?.onTransition?.(s, sNext, r, V[s]!);
      if (done) break;
      s = sNext;
    }
    hooks?.onEpisode?.(ep, deltaSum);
  }
  return V;
}
