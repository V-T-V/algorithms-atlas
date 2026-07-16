// GRASP 元启发（GRASP Metaheuristic）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-grasp',
  categoryId: 'optimization',
  title: { zh: 'GRASP 元启发', en: 'GRASP Metaheuristic' },
  summary: {
    zh: '反复构造贪婪随机解再局部改进，保留最优。',
    en: 'Repeatedly build greedy-random solutions then locally improve; keep the best.',
  },
  description: {
    zh: 'GRASP：每轮从受限候选列表(RCL)随机选元素构造解，再做局部搜索，取多轮最优。',
    en: 'GRASP: each round build a solution by random picks from a restricted candidate list, then local search.',
  },
  tags: ['optimization', 'metaheuristic'],
  complexity: { time: 'O(k·n²)', space: 'O(n)' },
};
