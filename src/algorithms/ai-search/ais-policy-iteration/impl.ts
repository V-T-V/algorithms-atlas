// 策略迭代 · 实现

/** 确定性有限 MDP。 */
export interface Mdp {
  states: number[];
  actions: number[];
  /** 转移与奖励：transitions[s][a] = 列表 of (sNext, prob, reward)。 */
  transitions: Record<number, Record<number, ReadonlyArray<readonly [number, number, number]>>>;
  gamma: number;
}

export interface PolicyHooks {
  onEvaluate?: (V: Float64Array) => void;
  onImprove?: (policy: number[], changed: number) => void;
}

/** 策略评估：迭代求解 V^π（线性方程组，Jacobi 迭代）。 */
export function policyEvaluate(
  mdp: Mdp,
  policy: number[],
  V: Float64Array,
  iters = 100,
  tol = 1e-7,
): Float64Array {
  for (let k = 0; k < iters; k++) {
    const newV = new Float64Array(V);
    let maxDelta = 0;
    for (const s of mdp.states) {
      const a = policy[s]!;
      const outcomes = mdp.transitions[s]?.[a] ?? [];
      let sum = 0;
      for (const [sNext, p, r] of outcomes) {
        sum += p * (r + mdp.gamma * V[sNext]!);
      }
      newV[s] = sum;
      maxDelta = Math.max(maxDelta, Math.abs(sum - V[s]!));
    }
    V.set(newV);
    if (maxDelta < tol) break;
  }
  return V;
}

/** 策略改进：返回改变状态数。 */
export function policyImprove(mdp: Mdp, V: Float64Array, policy: number[]): number {
  let changed = 0;
  for (const s of mdp.states) {
    let bestA = policy[s]!;
    let bestQ = -Infinity;
    for (const a of mdp.actions) {
      const outcomes = mdp.transitions[s]?.[a] ?? [];
      let q = 0;
      for (const [sNext, p, r] of outcomes) {
        q += p * (r + mdp.gamma * V[sNext]!);
      }
      if (q > bestQ + 1e-12) {
        bestQ = q;
        bestA = a;
      }
    }
    if (bestA !== policy[s]) {
      changed++;
      policy[s] = bestA;
    }
  }
  return changed;
}

/** 策略迭代：返回 (最优策略, 最优价值)。 */
export function policyIteration(
  mdp: Mdp,
  hooks?: PolicyHooks,
): { policy: number[]; V: Float64Array } {
  const policy = mdp.states.map((_s) => mdp.actions[0]!);
  const V = new Float64Array(Math.max(...mdp.states) + 1);
  for (let iter = 0; iter < 1000; iter++) {
    policyEvaluate(mdp, policy, V);
    hooks?.onEvaluate?.(V);
    const changed = policyImprove(mdp, V, policy);
    hooks?.onImprove?.([...policy], changed);
    if (changed === 0) break;
  }
  return { policy, V };
}
