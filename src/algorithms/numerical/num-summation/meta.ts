// 数列求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-summation',
  categoryId: 'numerical',
  title: { zh: '数列求和', en: 'Series Summation' },
  summary: { zh: '对函数生成的数列求和。', en: 'Sum a series produced by a function.' },
  description: { zh: 'Σᵢ₌₀ⁿ⁻¹ f(i)。', en: 'Σᵢ₌₀ⁿ⁻¹ f(i).' },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
