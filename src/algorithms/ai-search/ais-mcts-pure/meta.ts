// 纯 MCTS · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-mcts-pure',
  categoryId: 'ai-search',
  title: { zh: '纯蒙特卡洛树搜索 (Pure MCTS)', en: 'Pure Monte Carlo Tree Search' },
  summary: {
    zh: 'MCTS 四阶段一体：选择(UCB1)+扩展+随机 rollout+回传，迭代收敛到最优动作。',
    en: 'Unified MCTS four phases: selection(UCB1) + expansion + random rollout + backup, iterating toward the best action.',
  },
  description: {
    zh: '本实现把 MCTS 的四个阶段（选择、扩展、模拟、回传）集成为完整的搜索循环。给定领域（合法动作、转移、终局判定、奖励），从根出发反复执行：用 UCB1 树策略下降到待扩展节点；扩展一个新子节点；从该节点随机 rollout 到终局得到奖励；沿父链回传。迭代 N 次后，推荐访问次数最多的子动作。与现有 mcts 区别在于：本实现是自包含的纯函数式流程演示，接口更简洁。',
    en: 'This implementation unifies the four MCTS phases (selection, expansion, simulation, backup) into one search loop. Given a domain (legal actions, transition, terminal test, reward), it repeatedly runs from the root: descend via UCB1 tree policy to an expandable node; expand a new child; rollout randomly from it to a terminal for a reward; backup along the parent chain. After N iterations it recommends the most-visited child action. Unlike the existing mcts, this is a self-contained, purely functional demo with a simpler interface.',
  },
  tags: ['ai-search', 'mcts', 'search', 'ucb1'],
  complexity: { time: 'O(N·d)', space: 'O(N·b)' },
};
