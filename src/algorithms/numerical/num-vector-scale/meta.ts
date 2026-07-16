// 向量数乘 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-vector-scale',
  categoryId: 'numerical',
  title: { zh: '向量数乘', en: 'Vector Scaling' },
  summary: { zh: '向量与标量相乘。', en: 'Multiply a vector by a scalar.' },
  description: { zh: '(k·a)ᵢ = k·aᵢ。', en: '(k·a)ᵢ = k·aᵢ.' },
  tags: ['numerical', 'linear-algebra'],
  complexity: { time: 'O(d)', space: 'O(d)' },
};
