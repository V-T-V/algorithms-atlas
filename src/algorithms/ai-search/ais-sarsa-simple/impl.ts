// SARSA · 实现

import type { QDomain, QHooks } from '../ais-q-learning-simple/impl.ts';
import { epsilonGreedy, initQ } from '../ais-q-learning-simple/impl.ts';

export interface SarsaOpts {
  gamma: number;
  alpha: number;
  epsilon: number;
  episodes: number;
  maxSteps: number;
  rng: () => number;
  hooks?: QHooks;
}

/** SARSA 训练，返回 Q 表。 */
export function sarsa(domain: QDomain, opts: SarsaOpts): Float64Array[] {
  const { gamma, alpha, epsilon, episodes, maxSteps, rng, hooks } = opts;
  const Q = initQ(Math.max(...domain.states) + 1, Math.max(...domain.actions) + 1);
  for (let ep = 0; ep < episodes; ep++) {
    let s = domain.start(rng);
    let a = epsilonGreedy(Q, s, domain.actions, epsilon, rng);
    let ret = 0;
    for (let t = 0; t < maxSteps; t++) {
      const [sNext, r, done] = domain.step(s, a, rng);
      const aNext = done ? a : epsilonGreedy(Q, sNext, domain.actions, epsilon, rng);
      const nextQ = done ? 0 : Q[sNext]![aNext]!;
      const delta = r + gamma * nextQ - Q[s]![a]!;
      Q[s]![a] = Q[s]![a]! + alpha * delta;
      ret += r;
      hooks?.onTransition?.(s, a, sNext, r, delta);
      if (done) break;
      s = sNext;
      a = aNext;
    }
    hooks?.onEpisode?.(ep, ret, Q);
  }
  return Q;
}
