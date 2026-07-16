// 古诺寡头博弈（Cournot Duopoly）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-cournot',
  categoryId: 'game',
  title: { zh: '古诺寡头博弈', en: 'Cournot Duopoly' },
  summary: {
    zh: '两厂商同时选产量，市场价格由总产量决定，求纳什均衡。',
    en: 'Two firms choose quantities simultaneously; price falls with total quantity; find Nash equilibrium.',
  },
  description: {
    zh: '古诺：两厂商成本 c_i，产量 q_i，价格 P=a-b(q1+q2)。利润 π_i=(P-c_i)q_i。一阶条件得均衡 q_i*=(a+c_j-2c_i)/(3b)。',
    en: 'Cournot: costs c_i, quantities q_i, price P=a-b(q1+q2). Profit π_i=(P-c_i)q_i. FOC gives q_i*=(a+c_j-2c_i)/(3b).',
  },
  tags: ['game', 'economics', 'oligopoly'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
