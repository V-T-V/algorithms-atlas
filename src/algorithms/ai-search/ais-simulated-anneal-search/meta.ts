// 模拟退火搜索（Simulated Annealing Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-simulated-anneal-search',
  categoryId: 'ai-search',
  title: { zh: '模拟退火搜索', en: 'Simulated Annealing Search' },
  summary: {
    zh: '以概率 exp(Δ/T) 接受劣解，温度按计划衰减。',
    en: 'Accept worse moves with probability exp(Δ/T); temperature cools on a schedule.',
  },
  description: {
    zh: '模拟退火（Kirkpatrick 1983）：以温度 T 控制接受劣解的概率 p = exp(ΔE/T)。T 从 T0 按指数衰减到 T_end。能跳出局部最优。',
    en: 'Simulated annealing (Kirkpatrick 1983): probability p = exp(ΔE/T) of accepting worse moves; T decays exponentially from T0 to T_end. Escapes local optima.',
  },
  tags: ['ai-search', 'metaheuristic', 'optimization', 'annealing'],
  complexity: { time: 'O(iter)', space: 'O(1)' },
};
