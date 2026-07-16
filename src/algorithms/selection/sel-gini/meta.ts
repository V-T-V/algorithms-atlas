// 基尼系数（Gini Coefficient）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sel-gini',
  categoryId: 'selection',
  title: { zh: '基尼系数', en: 'Gini Coefficient' },
  summary: {
    zh: 'Gini 系数：衡量分布不均匀度（0=完全均匀，1=极度不均）。',
    en: 'Gini coefficient: measures inequality (0=fully equal, 1=maximally unequal).',
  },
  description: {
    zh: '基尼系数用洛伦兹曲线计算：G = (Σᵢ Σⱼ |xᵢ − xⱼ|) / (2n Σxᵢ)。0 表示完全均匀，接近 1 表示极度不均。',
    en: 'Gini coefficient from the Lorenz curve: G = (Σᵢ Σⱼ |xᵢ − xⱼ|) / (2n Σxᵢ). 0 means fully equal, near 1 means maximally unequal.',
  },
  tags: ['selection', 'statistics', 'gini', 'inequality'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
