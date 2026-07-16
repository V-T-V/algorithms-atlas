// Count-Min Sketch · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-count-min',
  categoryId: 'randomized',
  title: { zh: 'Count-Min Sketch', en: 'Count-Min Sketch' },
  summary: { zh: '频率估计的概率数据结构。', en: 'Probabilistic frequency estimation structure.' },
  description: { zh: '多个哈希行，取最小计数。', en: 'Multiple hash rows; take minimum count.' },
  tags: ['randomized', 'data-structure', 'sketch'],
  complexity: { time: 'O(k)', space: 'O(d·w)' },
};
