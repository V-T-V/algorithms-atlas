export interface TdHooks {
  onStep?: (s: number, r: number, v: number) => void;
  onEpisode?: (ep: number) => void;
}
export interface TdProblem {
  states: number[];
  policy: (s: number) => number;
  step: (s: number, a: number) => { s2: number; r: number; done: boolean };
  episodes: number;
  maxSteps: number;
  alpha: number;
  gamma: number;
}
export function tdZero(p: TdProblem, hooks: TdHooks = {}): number[] {
  const V = p.states.map(() => 0);
  for (let ep = 0; ep < p.episodes; ep++) {
    let s = p.states[0]!;
    for (let st = 0; st < p.maxSteps; st++) {
      const a = p.policy(s);
      const { s2, r, done } = p.step(s, a);
      V[s] = V[s]! + p.alpha * (r + p.gamma * V[s2]! - V[s]!);
      hooks.onStep?.(s, r, V[s]!);
      s = s2;
      if (done) break;
    }
    hooks.onEpisode?.(ep);
  }
  return V;
}
