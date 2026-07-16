// =============================================================================
// 蒙特卡洛树搜索（Monte Carlo Tree Search, MCTS）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 选择/扩展/模拟/回传 四阶段。
// 用确定性 RNG + 简单领域保证可复现。
// =============================================================================

export type Rng = () => number; // 返回 [0,1)

/** 线性同余生成器（LCG），可复现随机源。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** 搜索树节点。 */
export interface MCNode {
  /** 状态（此处为「已选动作序列」对应的索引路径）。 */
  state: number;
  /** 父节点。 */
  parent: MCNode | null;
  /** 子节点。 */
  children: MCNode[];
  /** 本节点已完成模拟次数。 */
  visits: number;
  /** 累计奖励（从根节点视角）。 */
  totalReward: number;
  /** 尚未尝试的动作（用于扩展）。 */
  untriedActions: number[];
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MctsHooks {
  /** 选择阶段：从根沿 UCB1 向下选到一个节点。返回路径上节点状态序列。 */
  onSelect?: (path: number[]) => void;
  /** 扩展阶段：给节点新增一个子节点。 */
  onExpand?: (parentState: number, childState: number) => void;
  /** 模拟阶段：从状态出发随机走 roll 并返回 reward。 */
  onSimulate?: (startState: number, reward: number) => void;
  /** 回传阶段：把 reward 沿父链回填。 */
  onBackprop?: (path: number[], reward: number) => void;
}

export interface MctsResult {
  /** 最终推荐动作（根节点访问次数最多/平均奖励最高的子节点对应动作）。 */
  bestAction: number;
  /** 根节点。 */
  root: MCNode;
}

/** 领域定义：动作集合 + 转移 + 终局奖励估计。 */
export interface Domain {
  /** 根节点的合法动作集合。 */
  rootActions: number[];
  /** 给定「当前已做动作序列」，返回下一个可达动作集合（决定树深度）。 */
  nextActions: (path: number[]) => number[];
  /**
   * 从给定路径出发做一次随机 rollout，返回奖励（0..1）。
   * 用注入的 rng 保证可复现。
   */
  simulate: (path: number[], rng: Rng) => number;
}

/**
 * 默认领域：一个简单的 K-臂「阶梯」。
 * 根有 K 个动作；从每个动作再分出 K 个子动作；rollout 用加权随机数估计奖励，
 * 不同顶层动作有不同的「真实」平均奖励——MCTS 应当收敛到奖励最高的那个。
 *
 * @param arms 顶层臂数
 */
export function defaultDomain(arms: number = 3): Domain {
  // 每个顶层动作的真实期望（动作 0 最好）
  const truth = Array.from({ length: arms }, (_, i) => 0.9 - i * 0.25);
  const depth = 2; // 树深度：根 + 2 层
  return {
    rootActions: Array.from({ length: arms }, (_, i) => i),
    nextActions: (path) => (path.length >= depth ? [] : Array.from({ length: arms }, (_, i) => i)),
    simulate: (path, rng) => {
      // 奖励 = 顶层动作的真实期望 + 噪声（截断到 [0,1]）
      const top = path.length > 0 ? path[0]! : 0;
      const mu = truth[top] ?? 0.5;
      const noise = (rng() - 0.5) * 0.4; // ±0.2
      return Math.min(1, Math.max(0, mu + noise));
    },
  };
}

/** 创建根节点。 */
function makeRoot(state: number, actions: number[], parent: MCNode | null): MCNode {
  return {
    state,
    parent,
    children: [],
    visits: 0,
    totalReward: 0,
    untriedActions: [...actions],
  };
}

/** UCB1 选择子节点。探索常数 c 默认 √2。 */
function ucb1(child: MCNode, parentVisits: number, c: number): number {
  if (child.visits === 0) return Infinity;
  const exploit = child.totalReward / child.visits;
  const explore = c * Math.sqrt(Math.log(parentVisits) / child.visits);
  return exploit + explore;
}

/** 节点路径的「动作序列」（从根到本节点的 state 序列）。 */
function pathOf(node: MCNode): number[] {
  const path: number[] = [];
  let cur: MCNode | null = node;
  while (cur && cur.parent !== null) {
    path.unshift(cur.state);
    cur = cur.parent;
  }
  return path;
}

/**
 * 蒙特卡洛树搜索主函数。
 *
 * @param domain 问题领域
 * @param iterations 模拟预算（迭代次数）
 * @param rng 随机源（用于 rollout）
 * @param hooks 可选事件钩子
 */
export function mcts(
  domain: Domain,
  iterations: number,
  rng: Rng = makeLcg(42),
  hooks: MctsHooks = {},
): MctsResult {
  const root = makeRoot(-1, domain.rootActions, null);
  const exploreC = Math.SQRT2;

  for (let it = 0; it < iterations; it++) {
    // —— 1. Selection —— 沿 UCB1 向下走到「有未试动作或为叶」的节点
    let node = root;
    const selPath: number[] = [];
    while (node.untriedActions.length === 0 && node.children.length > 0) {
      // 全部动作已扩展过：用 UCB1 选最优子
      let best = node.children[0]!;
      let bestScore = -Infinity;
      for (const ch of node.children) {
        const s = ucb1(ch, node.visits === 0 ? 1 : node.visits, exploreC);
        if (s > bestScore) {
          bestScore = s;
          best = ch;
        }
      }
      node = best;
      selPath.push(node.state);
    }
    hooks.onSelect?.(selPath);

    // —— 2. Expansion —— 若该节点还有未试动作，扩展一个
    if (node.untriedActions.length > 0) {
      // 取首个未试动作（确定性）
      const action = node.untriedActions.shift()!;
      const childPath = pathOf(node).concat(action);
      const childActions = domain.nextActions(childPath);
      const child = makeRoot(action, childActions, node);
      node.children.push(child);
      hooks.onExpand?.(node.state, action);
      node = child;
    }

    // —— 3. Simulation —— 从新节点做随机 rollout
    const simPath = pathOf(node);
    const reward = domain.simulate(simPath, rng);
    hooks.onSimulate?.(node.state, reward);

    // —— 4. Backpropagation —— 沿父链回填
    const backPath: number[] = [];
    let cur: MCNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur.totalReward += reward;
      if (cur.parent !== null) backPath.unshift(cur.state);
      cur = cur.parent;
    }
    hooks.onBackprop?.(backPath, reward);
  }

  // 选根节点下访问次数最多（平均奖励最高）的子节点作为推荐动作
  let bestAction = -1;
  let bestVisits = -1;
  for (const ch of root.children) {
    if (ch.visits > bestVisits) {
      bestVisits = ch.visits;
      bestAction = ch.state;
    }
  }
  if (bestAction === -1 && root.children.length > 0) {
    bestAction = root.children[0]!.state;
  }
  return { bestAction, root };
}
