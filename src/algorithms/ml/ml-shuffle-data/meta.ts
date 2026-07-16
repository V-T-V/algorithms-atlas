// 数据打乱 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-shuffle-data',
  categoryId: 'ml',
  title: { zh: '数据打乱', en: 'Data Shuffling' },
  summary: { zh: '用种子可复现地打乱数据顺序。', en: 'Reproducibly shuffle data with a seed.' },
  description: {
    zh: 'Fisher-Yates 配合线性同余 RNG。',
    en: 'Fisher-Yates with a seeded LCG for reproducibility.',
  },
  tags: ['ml', 'preprocessing'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
