export interface McHooks {
  onEpisode?: (ep: number, G: number) => void;
  onReturn?: (s: number, G: number) => void;
}
export interface McProblem {
  states: number[];
  policy: (s: number) => number;
  step: (s: number, a: number) => { s2: number; r: number; done: boolean };
  episodes: number;
  maxSteps: number;
  gamma: number;
}
export function monteCarloEval(p: McProblem, hooks: McHooks = {}): number[] {
  const sum = p.states.map(() => 0);
  const cnt = p.states.map(() => 0);
  for (let ep = 0; ep < p.episodes; ep++) {
    const traj: Array<{ s: number; r: number }> = [];
    let s = p.states[0]!;
    for (let st = 0; st < p.maxSteps; st++) {
      const a = p.policy(s);
      const { s2, r, done } = p.step(s, a);
      traj.push({ s, r });
      s = s2;
      if (done) break;
    }
    let G = 0;
    const seen = new Set<number>();
    for (let i = traj.length - 1; i >= 0; i--) {
      G = p.gamma * G + traj[i]!.r;
      hooks.onReturn?.(traj[i]!.s, G);
      if (!seen.has(traj[i]!.s)) {
        seen.add(traj[i]!.s);
        sum[traj[i]!.s]! += G;
        cnt[traj[i]!.s]! += 1;
      }
    }
    hooks.onEpisode?.(ep, G);
  }
  return p.states.map((s) => (cnt[s]! > 0 ? sum[s]! / cnt[s]! : 0));
}
