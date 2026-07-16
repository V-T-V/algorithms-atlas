// 加权随机选择 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-choice-weighted',
  categoryId: 'randomized',
  title: { zh: '加权随机选择', en: 'Weighted Random Choice' },
  summary: { zh: '依权重数组抽样。', en: 'Sample one index according to weights.' },
  description: { zh: '累积权重二分查找。', en: 'Cumulative weights + binary search.' },
  tags: ['randomized', 'sampling'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
