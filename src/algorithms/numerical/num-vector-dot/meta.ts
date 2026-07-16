// 向量点积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-vector-dot',
  categoryId: 'numerical',
  title: { zh: '向量点积', en: 'Vector Dot Product' },
  summary: { zh: 'Σ aᵢbᵢ。', en: 'Σ aᵢbᵢ.' },
  description: { zh: '点积是度量、投影的基础。', en: 'Foundation of metrics and projections.' },
  tags: ['numerical', 'linear-algebra'],
  complexity: { time: 'O(d)', space: 'O(1)' },
};
