// 默认策略 · 实现

export type Rng = () => number;

export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface RolloutDomain<S> {
  /** 当前状态的合法动作。 */
  legalActions: (state: S) => number[];
  /** 施加动作，返回新状态。 */
  apply: (state: S, action: number) => S;
  /** 是否终局。 */
  isTerminal: (state: S) => boolean;
  /** 终局奖励（站在根玩家视角，0..1）。 */
  reward: (state: S) => number;
}

export interface RolloutHooks {
  onStep?: (action: number, depth: number) => void;
  onResult?: (reward: number, depth: number) => void;
}

/** 纯随机 rollout。 */
export function randomRollout<S>(
  state: S,
  domain: RolloutDomain<S>,
  rng: Rng,
  maxDepth = 1000,
  hooks: RolloutHooks = {},
): number {
  let s = state;
  let depth = 0;
  while (!domain.isTerminal(s) && depth < maxDepth) {
    const actions = domain.legalActions(s);
    if (actions.length === 0) break;
    const action = actions[Math.floor(rng() * actions.length)]!;
    hooks.onStep?.(action, depth);
    s = domain.apply(s, action);
    depth++;
  }
  const r = domain.reward(s);
  hooks.onResult?.(r, depth);
  return r;
}

/** 基于动作权重的 rollout（贪婪/ε-贪婪）。 */
export function weightedRollout<S>(
  state: S,
  domain: RolloutDomain<S> & { actionWeight?: (state: S, action: number) => number },
  rng: Rng,
  maxDepth = 1000,
  epsilon = 0.1,
  hooks: RolloutHooks = {},
): number {
  let s = state;
  let depth = 0;
  while (!domain.isTerminal(s) && depth < maxDepth) {
    const actions = domain.legalActions(s);
    if (actions.length === 0) break;
    let action: number;
    if (rng() < epsilon || !domain.actionWeight) {
      action = actions[Math.floor(rng() * actions.length)]!;
    } else {
      // 选权重最大的
      let best = actions[0]!;
      let bestW = domain.actionWeight(s, best);
      for (const a of actions) {
        const w = domain.actionWeight(s, a);
        if (w > bestW) {
          bestW = w;
          best = a;
        }
      }
      action = best;
    }
    hooks.onStep?.(action, depth);
    s = domain.apply(s, action);
    depth++;
  }
  const r = domain.reward(s);
  hooks.onResult?.(r, depth);
  return r;
}
