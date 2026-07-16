// =============================================================================
// 渐进偏置（Progressive Bias）· 纯算法实现
// UCB1 + W·H(a)/(visits(a)+1) 的偏置项，初期靠 H(a) 引导。
// =============================================================================

export type Rng = () => number;

export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface PbNode {
  state: number;
  parent: PbNode | null;
  children: PbNode[];
  visits: number;
  totalReward: number;
  untriedActions: number[];
}

export interface PbConfig {
  iterations: number;
  /** 偏置权重 W。 */
  biasWeight: number;
  /** 探索常数。 */
  exploreC: number;
  /** 领域启发式：H[action] = 该动作的先验质量（如 0..1）。 */
  heuristic: (action: number) => number;
}

export const DEFAULT_PB_CONFIG: Omit<PbConfig, 'heuristic'> = {
  iterations: 30,
  biasWeight: 5,
  exploreC: Math.SQRT2,
};

export interface Domain {
  rootActions: number[];
  nextActions: (path: number[]) => number[];
  simulate: (path: number[], rng: Rng) => number;
}

export function defaultDomain(arms: number = 3): Domain {
  const truth = Array.from({ length: arms }, (_, i) => 0.9 - i * 0.25);
  const depth = 2;
  return {
    rootActions: Array.from({ length: arms }, (_, i) => i),
    nextActions: (path) => (path.length >= depth ? [] : Array.from({ length: arms }, (_, i) => i)),
    simulate: (path, rng) => {
      const top = path.length > 0 ? path[0]! : 0;
      const mu = truth[top] ?? 0.5;
      const noise = (rng() - 0.5) * 0.4;
      return Math.min(1, Math.max(0, mu + noise));
    },
  };
}

export interface PbHooks {
  onIter?: (iter: number) => void;
  onExpand?: (parentState: number, childState: number) => void;
  onSelect?: (chosenAction: number, biasContribution: number) => void;
}

export interface PbResult {
  bestAction: number;
  root: PbNode;
}

function makeRoot(state: number, actions: number[], parent: PbNode | null): PbNode {
  return {
    state,
    parent,
    children: [],
    visits: 0,
    totalReward: 0,
    untriedActions: [...actions],
  };
}

function pathOf(node: PbNode): number[] {
  const path: number[] = [];
  let cur: PbNode | null = node;
  while (cur && cur.parent !== null) {
    path.unshift(cur.state);
    cur = cur.parent;
  }
  return path;
}

/** UCB1 + Progressive Bias。 */
function pbScore(
  child: PbNode,
  parentVisits: number,
  config: PbConfig,
): { score: number; bias: number } {
  if (child.visits === 0)
    return { score: Infinity, bias: config.biasWeight * config.heuristic(child.state) };
  const exploit = child.totalReward / child.visits;
  const explore = config.exploreC * Math.sqrt(Math.log(parentVisits) / child.visits);
  const bias = (config.biasWeight * config.heuristic(child.state)) / (child.visits + 1);
  return { score: exploit + explore + bias, bias };
}

export function progressiveBias(
  domain: Domain,
  config: PbConfig,
  rng: Rng = makeLcg(42),
  hooks: PbHooks = {},
): PbResult {
  const root = makeRoot(-1, domain.rootActions, null);

  for (let it = 0; it < config.iterations; it++) {
    hooks.onIter?.(it);

    // Selection
    let node = root;
    while (node.untriedActions.length === 0 && node.children.length > 0) {
      let best = node.children[0]!;
      let bestScore = -Infinity;
      let bestBias = 0;
      for (const ch of node.children) {
        const { score, bias } = pbScore(ch, node.visits === 0 ? 1 : node.visits, config);
        if (score > bestScore) {
          bestScore = score;
          best = ch;
          bestBias = bias;
        }
      }
      hooks.onSelect?.(best.state, bestBias);
      node = best;
    }

    // Expansion
    if (node.untriedActions.length > 0) {
      const action = node.untriedActions.shift()!;
      const childPath = pathOf(node).concat(action);
      const childActions = domain.nextActions(childPath);
      const child = makeRoot(action, childActions, node);
      node.children.push(child);
      hooks.onExpand?.(node.state, action);
      node = child;
    }

    // Simulation
    const simPath = pathOf(node);
    const reward = domain.simulate(simPath, rng);

    // Backprop
    let cur: PbNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur.totalReward += reward;
      cur = cur.parent;
    }
  }

  let bestAction = -1;
  let bestVisits = -1;
  for (const ch of root.children) {
    if (ch.visits > bestVisits) {
      bestVisits = ch.visits;
      bestAction = ch.state;
    }
  }
  if (bestAction === -1 && root.children.length > 0) bestAction = root.children[0]!.state;

  return { bestAction, root };
}
