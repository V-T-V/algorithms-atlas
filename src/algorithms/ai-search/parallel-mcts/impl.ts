// =============================================================================
// 并行 MCTS（树并行 + 虚拟损失）· 纯算法实现
// 用确定性 RNG 序列模拟多 worker 串行执行（共享树 + virtual loss）。
// =============================================================================

export type Rng = () => number;

/** 线性同余生成器。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export interface PMCNode {
  state: number;
  parent: PMCNode | null;
  children: PMCNode[];
  visits: number;
  totalReward: number;
  /** 虚拟损失（被并发 worker 占用的次数）。 */
  virtualLoss: number;
  untriedActions: number[];
}

export interface ParallelMctsConfig {
  /** worker 数。 */
  workers: number;
  /** 总迭代预算（所有 worker 共享）。 */
  iterations: number;
  /** 虚拟损失惩罚量。 */
  virtualLossPenalty: number;
  /** 探索常数。 */
  exploreC: number;
}

export const DEFAULT_PM_CONFIG: ParallelMctsConfig = {
  workers: 4,
  iterations: 40,
  virtualLossPenalty: 1,
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

export interface ParallelMctsHooks {
  /** 一次 worker 迭代开始。 */
  onWorkerIter?: (worker: number, iter: number) => void;
  /** 某节点被加虚拟损失。 */
  onVirtualLoss?: (nodeId: number, worker: number) => void;
  /** 某节点撤销虚拟损失（回传）。 */
  onUndoVirtualLoss?: (nodeId: number, worker: number) => void;
  onExpand?: (parentState: number, childState: number) => void;
  onSimulate?: (worker: number, reward: number) => void;
}

let nodeCounter = 0;

function makeRoot(state: number, actions: number[], parent: PMCNode | null): PMCNode {
  return {
    state,
    parent,
    children: [],
    visits: 0,
    totalReward: 0,
    virtualLoss: 0,
    untriedActions: [...actions],
  };
}

function pathOf(node: PMCNode): number[] {
  const path: number[] = [];
  let cur: PMCNode | null = node;
  while (cur && cur.parent !== null) {
    path.unshift(cur.state);
    cur = cur.parent;
  }
  return path;
}

/** 带 virtual loss 的 UCB1：把 virtualLoss 从 visits/reward 中扣除。 */
function ucb1VL(child: PMCNode, parentVisits: number, c: number, penalty: number): number {
  const effVisits = child.visits + child.virtualLoss;
  if (effVisits === 0) return Infinity;
  const exploit = (child.totalReward - child.virtualLoss * penalty) / effVisits;
  const explore = c * Math.sqrt(Math.log(parentVisits) / effVisits);
  return exploit + explore;
}

export interface ParallelMctsResult {
  bestAction: number;
  root: PMCNode;
  /** 每个 worker 的 rollout 数。 */
  workerRollouts: number[];
}

/** 给每个节点分配一个稳定 id（用于 hook）。 */
function assignIds(node: PMCNode): void {
  for (const ch of node.children) {
    nodeCounter += 1;
    (ch as PMCNode & { __id: number }).__id = nodeCounter;
    assignIds(ch);
  }
}

/**
 * 并行 MCTS（virtual-loss 模拟）。
 */
export function parallelMcts(
  domain: Domain,
  config: ParallelMctsConfig = DEFAULT_PM_CONFIG,
  rng: Rng = makeLcg(42),
  hooks: ParallelMctsHooks = {},
): ParallelMctsResult {
  nodeCounter = 0;
  const root = makeRoot(-1, domain.rootActions, null);
  (root as PMCNode & { __id: number }).__id = 0;

  const workerRollouts = new Array<number>(config.workers).fill(0);
  const itersPerWorker = Math.ceil(config.iterations / config.workers);

  let globalIter = 0;
  for (let w = 0; w < config.workers; w++) {
    for (let it = 0; it < itersPerWorker && globalIter < config.iterations; it++, globalIter++) {
      hooks.onWorkerIter?.(w, it);

      // 1. Selection（带 virtual loss）
      let node = root;
      const selPath: PMCNode[] = [root];
      while (node.untriedActions.length === 0 && node.children.length > 0) {
        // 全部子已扩展过 → UCB1 选最优
        let best = node.children[0]!;
        let bestScore = -Infinity;
        for (const ch of node.children) {
          const s = ucb1VL(
            ch,
            node.visits === 0 ? 1 : node.visits,
            config.exploreC,
            config.virtualLossPenalty,
          );
          if (s > bestScore) {
            bestScore = s;
            best = ch;
          }
        }
        // 加虚拟损失
        best.virtualLoss += 1;
        const id = (best as PMCNode & { __id?: number }).__id ?? -1;
        hooks.onVirtualLoss?.(id, w);
        node = best;
        selPath.push(node);
      }

      // 2. Expansion
      if (node.untriedActions.length > 0) {
        const action = node.untriedActions.shift()!;
        const childPath = pathOf(node).concat(action);
        const childActions = domain.nextActions(childPath);
        const child = makeRoot(action, childActions, node);
        nodeCounter += 1;
        (child as PMCNode & { __id: number }).__id = nodeCounter;
        node.children.push(child);
        hooks.onExpand?.(node.state, action);
        node = child;
        selPath.push(node);
      }

      // 3. Simulation
      const simPath = pathOf(node);
      const reward = domain.simulate(simPath, rng);
      workerRollouts[w] = (workerRollouts[w] ?? 0) + 1;
      hooks.onSimulate?.(w, reward);

      // 4. Backprop（撤销 virtual loss，回填 reward）
      for (const n of selPath) {
        n.visits++;
        n.totalReward += reward;
        if (n.virtualLoss > 0) {
          n.virtualLoss -= 1;
          const id = (n as PMCNode & { __id?: number }).__id ?? -1;
          hooks.onUndoVirtualLoss?.(id, w);
        }
      }
    }
  }

  assignIds(root);

  // 选根下访问次数最多的子
  let bestAction = -1;
  let bestVisits = -1;
  for (const ch of root.children) {
    if (ch.visits > bestVisits) {
      bestVisits = ch.visits;
      bestAction = ch.state;
    }
  }
  if (bestAction === -1 && root.children.length > 0) bestAction = root.children[0]!.state;

  return { bestAction, root, workerRollouts };
}
