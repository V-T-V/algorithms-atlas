// 向量点积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ml-dot-product',
  categoryId: 'ml',
  title: { zh: '向量点积', en: 'Dot Product' },
  summary: { zh: '两向量点积 Σ aᵢbᵢ。', en: 'Dot product Σ aᵢbᵢ.' },
  description: {
    zh: '点积是度量、投影、神经网络的基础运算。',
    en: 'Foundation of metrics, projections, dense layers.',
  },
  tags: ['ml', 'linear-algebra'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
