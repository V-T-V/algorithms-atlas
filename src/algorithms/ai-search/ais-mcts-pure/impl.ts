// 纯 MCTS · 实现

export type Rng = () => number;

export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface MctsNode {
  action: number | null; // 从父到本节点的动作
  parent: MctsNode | null;
  children: MctsNode[];
  untried: number[];
  visits: number;
  wins: number;
}

export interface MctsDomain<S> {
  legalActions: (s: S) => number[];
  apply: (s: S, a: number) => S;
  isTerminal: (s: S) => boolean;
  reward: (s: S) => number; // 站在根玩家
}

export interface MctsHooks {
  onIteration?: (iter: number) => void;
  onSelect?: (action: number) => void;
  onExpand?: (action: number) => void;
  onRollout?: (reward: number) => void;
  onResult?: (bestAction: number, visits: number) => void;
}

function makeNode(action: number | null, parent: MctsNode | null): MctsNode {
  return { action, parent, children: [], untried: [], visits: 0, wins: 0 };
}

/** 完整 MCTS。 */
export function pureMcts<S>(
  rootState: S,
  domain: MctsDomain<S>,
  iterations: number,
  rng: Rng,
  c = Math.SQRT2,
  hooks: MctsHooks = {},
): { bestAction: number; root: MctsNode } {
  const root = makeNode(null, null);
  root.untried = domain.legalActions(rootState);

  for (let iter = 0; iter < iterations; iter++) {
    hooks.onIteration?.(iter);
    let node = root;
    let state = rootState;

    // 1. 选择
    while (node.untried.length === 0 && node.children.length > 0 && !domain.isTerminal(state)) {
      let best = node.children[0]!;
      let bestUcb = -Infinity;
      for (const ch of node.children) {
        if (ch.visits === 0) {
          best = ch;
          break;
        }
        const u = ch.wins / ch.visits + c * Math.sqrt(Math.log(node.visits) / ch.visits);
        if (u > bestUcb) {
          bestUcb = u;
          best = ch;
        }
      }
      node = best;
      if (node.action !== null) {
        state = domain.apply(state, node.action);
        hooks.onSelect?.(node.action);
      }
    }

    // 2. 扩展
    if (node.untried.length > 0 && !domain.isTerminal(state)) {
      const a = node.untried.pop()!;
      state = domain.apply(state, a);
      const child = makeNode(a, node);
      child.untried = domain.legalActions(state);
      node.children.push(child);
      node = child;
      hooks.onExpand?.(a);
    }

    // 3. 模拟（随机 rollout）
    let s = state;
    let depth = 0;
    while (!domain.isTerminal(s) && depth < 1000) {
      const acts = domain.legalActions(s);
      if (acts.length === 0) break;
      const a = acts[Math.floor(rng() * acts.length)]!;
      s = domain.apply(s, a);
      depth++;
    }
    const reward = domain.reward(s);
    hooks.onRollout?.(reward);

    // 4. 回传（单人：同向）
    let cur: MctsNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur.wins += reward;
      cur = cur.parent;
    }
  }

  // 选访问次数最多的子节点
  let bestChild = root.children[0] ?? null;
  for (const ch of root.children) {
    if (bestChild === null || ch.visits > bestChild.visits) bestChild = ch;
  }
  const bestAction = bestChild?.action ?? -1;
  hooks.onResult?.(bestAction, bestChild?.visits ?? 0);
  return { bestAction, root };
}
