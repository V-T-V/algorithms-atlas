// L1 范数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-norm-l1',
  categoryId: 'numerical',
  title: { zh: 'L1 范数', en: 'L1 Norm' },
  summary: { zh: '向量绝对值之和。', en: 'Sum of absolute values of a vector.' },
  description: { zh: '||x||₁=Σ|xᵢ|。', en: '||x||₁=Σ|xᵢ|.' },
  tags: ['numerical', 'linear-algebra'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
