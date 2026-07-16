// =============================================================================
// UCT 选择策略（UCB1 applied to Trees）· 纯算法实现
// 提供独立的 uctValue 与 UCT 选择类，可在任意带 visits/wins 的节点结构上工作。
// =============================================================================

/** 通用统计节点（与具体领域无关）。 */
export interface UctNode {
  visits: number;
  wins: number; // 站在「选择方」视角累计的赢
}

/**
 * 计算单节点 UCB 值。
 *
 * @param visits 子节点访问数
 * @param wins 子节点累计赢
 * @param parentVisits 父节点访问数
 * @param c 探索常数（默认 √2）
 * @returns UCB 值；visits=0 时返回 +∞（强制探索未访问节点）
 */
export function uctValue(
  visits: number,
  wins: number,
  parentVisits: number,
  c: number = Math.SQRT2,
): number {
  if (visits === 0) return Infinity;
  const exploit = wins / visits;
  const explore = c * Math.sqrt(Math.log(parentVisits) / visits);
  return exploit + explore;
}

export interface UctHooks {
  /** 选择完成，返回了第 idx 个子节点（及其 ucb）。 */
  onSelect?: (idx: number, ucb: number) => void;
}

/**
 * UCT 选择器：在父节点的子节点列表中选 UCB 最高的。
 */
export class UCT {
  /** 默认探索常数。 */
  readonly defaultC: number;

  constructor(c: number = Math.SQRT2) {
    this.defaultC = c;
  }

  /**
   * 选最优子节点索引。
   *
   * @param parent 父节点（用其 visits 作为 N）
   * @param children 子节点数组
   * @param c 探索常数（默认用构造时的值）
   * @param hooks 钩子
   * @returns 最优子节点索引
   */
  selectBest(
    parent: UctNode,
    children: UctNode[],
    c: number = this.defaultC,
    hooks: UctHooks = {},
  ): number {
    if (children.length === 0) {
      throw new Error('selectBest: children 不能为空');
    }

    // 父访问数；若为 0，所有 explore 项 log(0) 未定义 → 视作 1
    const N = parent.visits > 0 ? parent.visits : 1;

    let bestIdx = 0;
    let bestUcb = -Infinity;
    for (let i = 0; i < children.length; i++) {
      const child = children[i]!;
      const ucb = uctValue(child.visits, child.wins, N, c);
      if (ucb > bestUcb) {
        bestUcb = ucb;
        bestIdx = i;
      }
    }

    hooks.onSelect?.(bestIdx, bestUcb);
    return bestIdx;
  }

  /** 计算所有子节点的 UCB 值（用于可视化）。 */
  ucbValues(parent: UctNode, children: UctNode[], c: number = this.defaultC): number[] {
    const N = parent.visits > 0 ? parent.visits : 1;
    return children.map((child) => {
      if (child.visits === 0) return Infinity;
      return uctValue(child.visits, child.wins, N, c);
    });
  }
}

/**
 * 模拟一次「选择 → 假装模拟 → 回传」的最小循环，
 * 用于演示 UCT 在多次迭代后趋向最优子节点。
 *
 * @param rewards 各子节点的「真实」每次访问平均回报（∈ [0,1]）
 * @param iterations 迭代次数
 * @param c 探索常数
 * @param rng 随机源（模拟 rollout 的随机性）
 */
export function uctBandit(
  rewards: number[],
  iterations: number,
  c: number = Math.SQRT2,
  rng: () => number = Math.random,
): { parent: UctNode; children: UctNode[]; selections: number[] } {
  const parent: UctNode = { visits: 0, wins: 0 };
  const children: UctNode[] = rewards.map(() => ({ visits: 0, wins: 0 }));
  const selections = new Array<number>(rewards.length).fill(0);
  const uct = new UCT(c);

  for (let t = 0; t < iterations; t++) {
    // 选择
    const idx = uct.selectBest(parent, children, c);
    // 模拟：以真实期望为中心的伯努利抽样
    const reward = rng() < (rewards[idx] ?? 0.5) ? 1 : 0;
    // 回传
    parent.visits++;
    parent.wins += reward;
    children[idx]!.visits++;
    children[idx]!.wins += reward;
    selections[idx]!++;
  }

  return { parent, children, selections };
}

// —— 可复现随机源（LCG）—— ---------------------------------------------------

export function makeLcg(seed: number): () => number {
  let state = seed >>> 0;
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
