// 蝙蝠算法（Bat Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-bat-2',
  categoryId: 'optimization',
  title: { zh: '蝙蝠算法', en: 'Bat Algorithm' },
  summary: {
    zh: '模拟蝙蝠回声定位调频调响，群体搜索最优。',
    en: 'Mimics bat echolocation with frequency/loudness adjustment for swarm search.',
  },
  description: {
    zh: '蝙蝠算法：每只蝙蝠频率 f_i，位置更新 x←x+f·v，响度与脉冲率随迭代衰减。',
    en: 'Bat: each bat has frequency f; position x<-x+fv; loudness and pulse rate decay over iterations.',
  },
  tags: ['optimization', 'metaheuristic', 'swarm'],
  complexity: { time: 'O(k·n·d)', space: 'O(n·d)' },
};
