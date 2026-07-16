// RAVE (Rapid Action Value Estimation) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-rave-implementation',
  categoryId: 'ai-search',
  title: { zh: 'RAVE 快速动作价值估计', en: 'RAVE (Rapid Action Value Estimation)' },
  summary: {
    zh: '用「全局动作统计」为早期 MCTS 节点提供低方差的价值估计，加速收敛。',
    en: 'Use global action statistics to give low-variance value estimates for early MCTS nodes, speeding convergence.',
  },
  description: {
    zh: 'RAVE（Rapid Action Value Estimation）是 MCTS 的增强技术。新扩展的节点访问次数少，其动作价值估计方差大。RAVE 额外维护「该动作在所有包含它的模拟中出现并获胜的次数」，得到一个全局的 AMAF（All Moves As First）估计。最终价值 = β·RAVE + (1-β)·MC，其中 β 随访问次数增加而衰减（早期偏 RAVE，后期偏 MC）。显著加快围棋等游戏的收敛。',
    en: 'RAVE (Rapid Action Value Estimation) enhances MCTS. Newly expanded nodes have few visits, so their action-value estimates are high-variance. RAVE additionally tracks how often an action appears and wins across all simulations containing it, giving a global AMAF (All Moves As First) estimate. The final value = β·RAVE + (1-β)·MC, where β decays as visits grow (favoring RAVE early, MC later). It dramatically speeds convergence in games like Go.',
  },
  tags: ['ai-search', 'mcts', 'rave', 'amaf', 'value-estimation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
