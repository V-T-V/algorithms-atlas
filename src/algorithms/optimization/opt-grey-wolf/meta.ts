// 灰狼优化（Grey Wolf Optimizer）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-grey-wolf',
  categoryId: 'optimization',
  title: { zh: '灰狼优化', en: 'Grey Wolf Optimizer' },
  summary: {
    zh: '模拟狼群 αβδ 三阶领导狩猎，包围与攻击猎物。',
    en: 'Mimics alpha/beta/delta leadership hierarchy in encircling and attacking prey.',
  },
  description: {
    zh: 'GWO：α、β、δ 三只最优狼引导，其他狼根据三者位置更新位置，参数 a 线性递减。',
    en: 'GWO: top three wolves alpha/beta/delta guide; others update position from these three; param a decreases.',
  },
  tags: ['optimization', 'metaheuristic', 'swarm'],
  complexity: { time: 'O(k·n·d)', space: 'O(n·d)' },
};
