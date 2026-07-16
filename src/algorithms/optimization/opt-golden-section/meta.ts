// 黄金分割搜索（Golden Section Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-golden-section',
  categoryId: 'optimization',
  title: { zh: '黄金分割搜索', en: 'Golden Section Search' },
  summary: {
    zh: '在单峰区间上用黄金比布置探点，无需导数找极小。',
    en: 'Place probes by golden ratio on a unimodal interval; minimizes without derivatives.',
  },
  description: {
    zh: '黄金分割：在 [a,b] 内按 φ=0.618 布两点，比较函数值缩小区间。线性收敛率 0.618。',
    en: 'Golden section: two probes at ratio phi=0.618; shrink by comparing values. Linear rate 0.618.',
  },
  tags: ['optimization', 'line-search', 'unimodal'],
  complexity: { time: 'O(log(1/ε))', space: 'O(1)' },
};
