// 抖动采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-jitter',
  categoryId: 'randomized',
  title: { zh: '抖动采样', en: 'Jitter Sampling' },
  summary: { zh: '给定点添加随机抖动。', en: 'Add random jitter to points.' },
  description: { zh: 'xᵢ += uniform(-h,h)。', en: 'xᵢ += uniform(-h,h).' },
  tags: ['randomized', 'sampling'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
