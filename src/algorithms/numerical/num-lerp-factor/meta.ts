// 插值因子 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-lerp-factor',
  categoryId: 'numerical',
  title: { zh: '插值因子', en: 'Inverse Lerp (Factor)' },
  summary: { zh: '求 x 在 [a,b] 中的归一化位置。', en: 'Normalized position of x within [a,b].' },
  description: { zh: 't=(x-a)/(b-a) ∈ [0,1]。', en: 't=(x-a)/(b-a) in [0,1].' },
  tags: ['numerical', 'interpolation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
