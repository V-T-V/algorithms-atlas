// 随机博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stochastic-game',
  categoryId: 'game',
  title: { zh: '随机博弈', en: 'Stochastic Game' },
  summary: {
    zh: '状态间转移依赖双方行动；Shapley 1953 的两人零和随机博弈。',
    en: "State transitions depend on both players' actions; Shapley 1953 two-player zero-sum stochastic game.",
  },
  description: {
    zh: "随机博弈 = 多智能体 MDP。每个状态是矩阵博弈，动作组合决定即时收益与下一状态。值迭代求解：V(s) = val( A(s) + γ·P(s,a,s')V(s') )。本实现演示单状态自环的两步值迭代。",
    en: "Stochastic game = multi-agent MDP. Each state is a matrix game whose action profile yields reward and a transition. Value iteration: V(s) = val( A(s) + γ·P(s,a,s')V(s') ). This demo shows single self-loop state value iteration.",
  },
  tags: ['game', 'game-theory', 'mdp'],
  complexity: { time: 'O(k·m²·n²)', space: 'O(m·n)' },
};
