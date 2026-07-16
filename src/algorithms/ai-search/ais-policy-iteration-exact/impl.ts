export interface PiHooks {
  onEval?: (iter: number, V: number[]) => void;
  onImprove?: (policy: number[]) => void;
}
export interface PiMdp {
  states: number[];
  actions: number[];
  trans: (s: number, a: number) => Array<{ to: number; prob: number; reward: number }>;
  gamma: number;
  theta: number;
}
export function policyIterationExact(m: PiMdp, hooks: PiHooks = {}): number[] {
  const policy = m.states.map(() => m.actions[0]!);
  const V = m.states.map(() => 0);
  let iter = 0;
  while (true) {
    // 评估
    while (true) {
      let delta = 0;
      for (const s of m.states) {
        const a = policy[s]!;
        let sum = 0;
        for (const t of m.trans(s, a)) sum += t.prob * (t.reward + m.gamma * V[t.to]!);
        delta = Math.max(delta, Math.abs(V[s]! - sum));
        V[s] = sum;
      }
      iter++;
      hooks.onEval?.(iter, V);
      if (delta < m.theta) break;
    }
    // 改进
    let stable = true;
    for (const s of m.states) {
      let bestA = policy[s]!;
      let bestQ = -Infinity;
      for (const a of m.actions) {
        let q = 0;
        for (const t of m.trans(s, a)) q += t.prob * (t.reward + m.gamma * V[t.to]!);
        if (q > bestQ) {
          bestQ = q;
          bestA = a;
        }
      }
      if (bestA !== policy[s]) {
        policy[s] = bestA;
        stable = false;
      }
    }
    hooks.onImprove?.(policy);
    if (stable) break;
  }
  return policy;
}
