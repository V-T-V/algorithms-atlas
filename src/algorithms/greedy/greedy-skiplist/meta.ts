// 跳表贪心层数（Skip List Greedy Leveling）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-skiplist',
  categoryId: 'greedy',
  title: { zh: '跳表贪心层数', en: 'Skip List Greedy Leveling' },
  summary: {
    zh: '理想跳表用概率分层达到 O(log n) 查找，分析期望层数。',
    en: 'Ideal skip list uses probabilistic leveling for O(log n) search; analyze expected levels.',
  },
  description: {
    zh: '跳表：每节点以 p=1/2 概率提升一层。理想贪心分层使每层节点数减半，查找路径长度 O(log n)。',
    en: 'Skip list: each node promoted with p=1/2. Ideal greedy halving gives O(log n) search path length.',
  },
  tags: ['greedy', 'data-structure', 'probabilistic'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
