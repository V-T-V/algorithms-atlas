// 随机化惰性选择 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-lazy-select',
  categoryId: 'randomized',
  title: { zh: '随机化惰性选择', en: 'Randomized Lazy Select' },
  summary: { zh: '随机化第 k 小元素选择。', en: 'Randomized k-th smallest selection.' },
  description: {
    zh: '随机采样缩小候选范围再排序。',
    en: 'Random sample to shrink candidates, then sort.',
  },
  tags: ['randomized', 'selection'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
