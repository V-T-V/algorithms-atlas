// 向量加减 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-vector-add',
  categoryId: 'numerical',
  title: { zh: '向量加减', en: 'Vector Add/Subtract' },
  summary: { zh: '逐元素向量加减。', en: 'Element-wise vector add/subtract.' },
  description: { zh: '(a±b)ᵢ=aᵢ±bᵢ。', en: '(a±b)ᵢ=aᵢ±bᵢ.' },
  tags: ['numerical', 'linear-algebra'],
  complexity: { time: 'O(d)', space: 'O(d)' },
};
