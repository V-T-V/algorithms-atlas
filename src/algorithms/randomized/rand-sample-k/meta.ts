// 无放回 k 元采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-sample-k',
  categoryId: 'randomized',
  title: { zh: '无放回 k 元采样', en: 'Sample k Without Replacement' },
  summary: { zh: '从数组无放回抽取 k 个。', en: 'Sample k elements without replacement.' },
  description: {
    zh: '部分 Fisher-Yates：仅前 k 位乱序。',
    en: 'Partial Fisher-Yates: only first k positions randomized.',
  },
  tags: ['randomized', 'sampling'],
  complexity: { time: 'O(k)', space: 'O(k)' },
};
