// =============================================================================
// RAVE（Rapid Action Value Estimation）/ AMAF · 纯算法实现
// 在 K-臂 bandit 上模拟 AMAF：rollout 中所有「臂」都被记入 AMAF 表。
// 用 β(s) = sqrt(K / (3·visits + K)) 加权融合 RAVE 值与 MCTS 值。
// =============================================================================

export type Rng = () => number;

export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface RaveNode {
  state: number;
  parent: RaveNode | null;
  children: RaveNode[];
  visits: number;
  totalReward: number;
  untriedActions: number[];
  /** AMAF/RAVE 统计：所有 rollout 中包含此动作的总奖励与次数。 */
  amafVisits: number;
  amafTotal: number;
}

export interface RaveConfig {
  iterations: number;
  /** β 公式中的 K 值（越大越偏重 RAVE）。 */
  equivalenceParameter: number;
  /** 探索常数。 */
  exploreC: number;
}

export const DEFAULT_RAVE_CONFIG: RaveConfig = {
  iterations: 30,
  equivalenceParameter: 100,
  exploreC: Math.SQRT2,
};

export interface Domain {
  rootActions: number[];
  nextActions: (path: number[]) => number[];
  /** rollout 返回 (reward, 经过的动作集合)。 */
  simulateWithTrace: (path: number[], rng: Rng) => { reward: number; actions: number[] };
}

export function defaultDomain(arms: number = 3): Domain {
  const truth = Array.from({ length: arms }, (_, i) => 0.9 - i * 0.25);
  const depth = 2;
  return {
    rootActions: Array.from({ length: arms }, (_, i) => i),
    nextActions: (path) => (path.length >= depth ? [] : Array.from({ length: arms }, (_, i) => i)),
    simulateWithTrace: (path, rng) => {
      // rollout：在每层随机选一个臂，记录经过的所有臂
      const actions: number[] = [];
      let cur = [...path];
      while (cur.length < depth) {
        const a = Math.floor(rng() * arms);
        actions.push(a);
        cur = cur.concat(a);
      }
      // 奖励由「根动作」决定
      const top = path.length > 0 ? path[0]! : (actions[0] ?? 0);
      const mu = truth[top] ?? 0.5;
      const noise = (rng() - 0.5) * 0.4;
      const reward = Math.min(1, Math.max(0, mu + noise));
      return { reward, actions };
    },
  };
}

export interface RaveHooks {
  onIter?: (iter: number) => void;
  onExpand?: (parentState: number, childState: number) => void;
  onAmafUpdate?: (action: number, amafVisits: number, amafAvg: number) => void;
}

export interface RaveResult {
  bestAction: number;
  root: RaveNode;
}

function makeRoot(state: number, actions: number[], parent: RaveNode | null): RaveNode {
  return {
    state,
    parent,
    children: [],
    visits: 0,
    totalReward: 0,
    untriedActions: [...actions],
    amafVisits: 0,
    amafTotal: 0,
  };
}

function pathOf(node: RaveNode): number[] {
  const path: number[] = [];
  let cur: RaveNode | null = node;
  while (cur && cur.parent !== null) {
    path.unshift(cur.state);
    cur = cur.parent;
  }
  return path;
}

/** β(s) 加权：visits 少时偏 RAVE。 */
function beta(visits: number, K: number): number {
  return Math.sqrt(K / (3 * visits + K));
}

/** 融合 RAVE 与 MCTS 的 UCB1。 */
function raveUcb1(child: RaveNode, parentVisits: number, config: RaveConfig): number {
  if (child.visits === 0) return Infinity;
  const Qmcts = child.totalReward / child.visits;
  const Qrave = child.amafVisits > 0 ? child.amafTotal / child.amafVisits : Qmcts;
  const b = beta(child.visits, config.equivalenceParameter);
  const value = b * Qrave + (1 - b) * Qmcts;
  const explore = config.exploreC * Math.sqrt(Math.log(parentVisits) / child.visits);
  return value + explore;
}

export function rave(
  domain: Domain,
  config: RaveConfig = DEFAULT_RAVE_CONFIG,
  rng: Rng = makeLcg(42),
  hooks: RaveHooks = {},
): RaveResult {
  const root = makeRoot(-1, domain.rootActions, null);

  for (let it = 0; it < config.iterations; it++) {
    hooks.onIter?.(it);

    // 1. Selection
    let node = root;
    while (node.untriedActions.length === 0 && node.children.length > 0) {
      let best = node.children[0]!;
      let bestScore = -Infinity;
      for (const ch of node.children) {
        const s = raveUcb1(ch, node.visits === 0 ? 1 : node.visits, config);
        if (s > bestScore) {
          bestScore = s;
          best = ch;
        }
      }
      node = best;
    }

    // 2. Expansion
    if (node.untriedActions.length > 0) {
      const action = node.untriedActions.shift()!;
      const childPath = pathOf(node).concat(action);
      const childActions = domain.nextActions(childPath);
      const child = makeRoot(action, childActions, node);
      node.children.push(child);
      hooks.onExpand?.(node.state, action);
      node = child;
    }

    // 3. Simulation（带 trace）
    const simPath = pathOf(node);
    const { reward, actions } = domain.simulateWithTrace(simPath, rng);
    // 把 rollout 中出现的所有动作的 AMAF 统计更新（对所有「此后的动作」）
    // AMAF：对节点 n，其动作 a 的 AMAF 值来自「rollout 中 a 第一次（含 n 之后）出现后的结果」
    // 简化：对从根到叶路径上的每个节点 n，对每个 rollout 中出现的动作 a 更新 n 的子节点（state==a）的 AMAF
    const seenActions = new Set<number>(actions);
    // 沿选择路径，对每个祖先节点更新其子节点的 AMAF
    let anc: RaveNode | null = node;
    while (anc !== null) {
      for (const ch of anc.children) {
        if (seenActions.has(ch.state) || (anc === node && actions.length === 0)) {
          ch.amafVisits += 1;
          ch.amafTotal += reward;
          hooks.onAmafUpdate?.(
            ch.state,
            ch.amafVisits,
            ch.amafVisits > 0 ? ch.amafTotal / ch.amafVisits : 0,
          );
        }
      }
      anc = anc.parent;
    }

    // 4. Backprop（MCTS 值）
    let cur: RaveNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur.totalReward += reward;
      cur = cur.parent;
    }
  }

  // 推荐根下访问次数最多的子
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
