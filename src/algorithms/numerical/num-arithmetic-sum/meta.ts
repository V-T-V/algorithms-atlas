// 等差数列求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-arithmetic-sum',
  categoryId: 'numerical',
  title: { zh: '等差数列求和', en: 'Arithmetic Series Sum' },
  summary: { zh: '计算等差数列前 n 项和。', en: 'Sum of first n terms of an arithmetic series.' },
  description: {
    zh: 'Σᵢ₌₀ⁿ⁻¹(a₀+i·d) = n·(2a₀+(n-1)d)/2。',
    en: 'Σᵢ₌₀ⁿ⁻¹(a₀+i·d) = n·(2a₀+(n-1)d)/2.',
  },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
