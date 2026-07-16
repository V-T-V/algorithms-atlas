// Q-Learning · 实现

export interface QDomain {
  states: number[];
  actions: number[];
  step: (s: number, a: number, rng: () => number) => readonly [number, number, boolean];
  start: (rng: () => number) => number;
}

export interface QHooks {
  onTransition?: (s: number, a: number, sNext: number, r: number, qErr: number) => void;
  onEpisode?: (ep: number, ret: number, Q: Float64Array[]) => void;
}

export interface QLearningOpts {
  gamma: number;
  alpha: number;
  epsilon: number;
  episodes: number;
  maxSteps: number;
  rng: () => number;
  hooks?: QHooks;
}

/** ε-贪心动作选择。 */
export function epsilonGreedy(
  Q: Float64Array[],
  s: number,
  actions: number[],
  epsilon: number,
  rng: () => number,
): number {
  if (rng() < epsilon) return actions[Math.floor(rng() * actions.length)]!;
  let bestA = actions[0]!;
  let bestQ = -Infinity;
  for (const a of actions) {
    const q = Q[s]![a]!;
    if (q > bestQ) {
      bestQ = q;
      bestA = a;
    }
  }
  return bestA;
}

/** 初始化 Q 表为 0。 */
export function initQ(nStates: number, nActions: number): Float64Array[] {
  const Q: Float64Array[] = [];
  for (let s = 0; s < nStates; s++) Q.push(new Float64Array(nActions));
  return Q;
}

/** Q-Learning 训练，返回 Q 表。 */
export function qLearn(domain: QDomain, opts: QLearningOpts): Float64Array[] {
  const { gamma, alpha, epsilon, episodes, maxSteps, rng, hooks } = opts;
  const Q = initQ(Math.max(...domain.states) + 1, Math.max(...domain.actions) + 1);
  for (let ep = 0; ep < episodes; ep++) {
    let s = domain.start(rng);
    let ret = 0;
    for (let t = 0; t < maxSteps; t++) {
      const a = epsilonGreedy(Q, s, domain.actions, epsilon, rng);
      const [sNext, r, done] = domain.step(s, a, rng);
      let maxNext = 0;
      if (!done) {
        maxNext = -Infinity;
        for (const a2 of domain.actions) maxNext = Math.max(maxNext, Q[sNext]![a2]!);
        if (maxNext === -Infinity) maxNext = 0;
      }
      const delta = r + gamma * maxNext - Q[s]![a]!;
      Q[s]![a] = Q[s]![a]! + alpha * delta;
      ret += r;
      hooks?.onTransition?.(s, a, sNext, r, delta);
      if (done) break;
      s = sNext;
    }
    hooks?.onEpisode?.(ep, ret, Q);
  }
  return Q;
}

/** 从 Q 表提取贪心策略。 */
export function qToPolicy(Q: Float64Array[], states: number[], actions: number[]): number[] {
  return states.map((s) => {
    let bestA = actions[0]!;
    let bestQ = -Infinity;
    for (const a of actions) {
      if (Q[s]![a]! > bestQ) {
        bestQ = Q[s]![a]!;
        bestA = a;
      }
    }
    return bestA;
  });
}
