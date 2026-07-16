// 等宽分箱 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-bin-discretize',
  categoryId: 'ml',
  title: { zh: '等宽分箱', en: 'Equal-Width Binning' },
  summary: {
    zh: '把连续值划分为等宽区间。',
    en: 'Discretize continuous values into equal-width bins.',
  },
  description: {
    zh: '把 [min,max] 等分为 k 个区间，每个值映射到箱号。',
    en: 'Split [min,max] into k equal bins; map each value to its bin index.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
