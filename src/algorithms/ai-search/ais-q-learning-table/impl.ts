export interface QlHooks {
  onEpisode?: (ep: number, totalR: number) => void;
  onStep?: (s: number, a: number, r: number) => void;
}
export interface QlProblem {
  states: number[];
  actions: number[];
  step: (s: number, a: number) => { s2: number; r: number; done: boolean };
  episodes: number;
  maxSteps: number;
  alpha: number;
  gamma: number;
  epsilon: number;
  rand: () => number;
}
export function qLearningTable(p: QlProblem, hooks: QlHooks = {}): number[][] {
  const Q = p.states.map(() => p.actions.map(() => 0));
  for (let ep = 0; ep < p.episodes; ep++) {
    let s = p.states[0]!;
    let totalR = 0;
    for (let st = 0; st < p.maxSteps; st++) {
      const a =
        p.rand() < p.epsilon ? p.actions[Math.floor(p.rand() * p.actions.length)]! : argmax(Q[s]!);
      const { s2, r, done } = p.step(s, a);
      hooks.onStep?.(s, a, r);
      totalR += r;
      const maxNext = Math.max(...Q[s2]!);
      Q[s]![a] = Q[s]![a]! + p.alpha * (r + p.gamma * maxNext - Q[s]![a]!);
      s = s2;
      if (done) break;
    }
    hooks.onEpisode?.(ep, totalR);
  }
  return Q;
}
function argmax(arr: number[]): number {
  let bi = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i]! > arr[bi]!) bi = i;
  return bi;
}
