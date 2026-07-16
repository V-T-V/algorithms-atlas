// 布谷鸟搜索（Cuckoo Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-cuckoo-2',
  categoryId: 'optimization',
  title: { zh: '布谷鸟搜索', en: 'Cuckoo Search' },
  summary: {
    zh: '基于莱维飞行的随机搜索，弃差巢保留好巢。',
    en: 'Levy-flight random search; abandon worst nests, keep best.',
  },
  description: {
    zh: '布谷鸟搜索：每个巢代表一个解，新解由莱维飞行生成，按概率 pa 弃最差巢。',
    en: 'Cuckoo search: each nest a solution; new solutions via Levy flights; abandon worst nests with prob pa.',
  },
  tags: ['optimization', 'metaheuristic', 'levy'],
  complexity: { time: 'O(k·n·d)', space: 'O(n·d)' },
};
