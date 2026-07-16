// 贝叶斯博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-bayesian-game',
  categoryId: 'game',
  title: { zh: '贝叶斯博弈', en: 'Bayesian Game' },
  summary: {
    zh: '玩家有不完全信息（私有类型），按类型先验最大化期望收益。',
    en: 'Players have incomplete information (private types) and maximize expected payoff given priors.',
  },
  description: {
    zh: '贝叶斯博弈：每个玩家有类型 θ_i，按联合先验分布抽取。策略是「类型 → 动作」的映射。贝叶斯纳什均衡：给定对手策略与类型先验，每类玩家最优。本实现演示两人的两类型博弈，求行玩家的最佳响应。',
    en: "Bayesian game: each player has a type θ_i drawn from a joint prior. A strategy maps types to actions. Bayesian-Nash equilibrium: each type best-responds given the prior and others' strategies. This solves player 1's best response in a 2-type, 2-player setting.",
  },
  tags: ['game', 'game-theory', 'bayesian'],
  complexity: { time: 'O(T²·A²)', space: 'O(1)' },
};
