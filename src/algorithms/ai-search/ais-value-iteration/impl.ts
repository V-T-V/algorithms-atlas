// 价值迭代 · 实现

import type { Mdp } from '../ais-policy-iteration/impl.ts';

export interface ValueIterHooks {
  onSweep?: (k: number, V: Float64Array, maxDelta: number) => void;
}

/** 单次贝尔曼最优备份，返回新价值与最大变化。 */
export function bellmanBackup(mdp: Mdp, V: Float64Array): { next: Float64Array; maxDelta: number } {
  const next = new Float64Array(V);
  let maxDelta = 0;
  for (const s of mdp.states) {
    let best = -Infinity;
    for (const a of mdp.actions) {
      const outcomes = mdp.transitions[s]?.[a] ?? [];
      let q = 0;
      for (const [sNext, p, r] of outcomes) {
        q += p * (r + mdp.gamma * V[sNext]!);
      }
      if (q > best) best = q;
    }
    if (best === -Infinity) best = V[s]!; // 无可达转移
    next[s] = best;
    maxDelta = Math.max(maxDelta, Math.abs(best - V[s]!));
  }
  return { next, maxDelta };
}

/** 价值迭代：返回 (最优价值, 迭代次数)。 */
export function valueIteration(
  mdp: Mdp,
  iters = 10000,
  tol = 1e-7,
  hooks?: ValueIterHooks,
): { V: Float64Array; k: number } {
  const V = new Float64Array(Math.max(...mdp.states) + 1);
  let k = 0;
  for (; k < iters; k++) {
    const { next, maxDelta } = bellmanBackup(mdp, V);
    V.set(next);
    hooks?.onSweep?.(k + 1, V, maxDelta);
    if (maxDelta < tol) break;
  }
  return { V, k: k + 1 };
}

/** 由最优价值提取贪心策略。 */
export function greedyPolicy(mdp: Mdp, V: Float64Array): number[] {
  const policy: number[] = [];
  for (const s of mdp.states) {
    let bestA = mdp.actions[0]!;
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
    policy[s] = bestA;
  }
  return policy;
}
