// 等比数列求和 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-geometric-sum',
  categoryId: 'numerical',
  title: { zh: '等比数列求和', en: 'Geometric Series Sum' },
  summary: { zh: '计算等比数列前 n 项和。', en: 'Sum of first n terms of a geometric series.' },
  description: { zh: 'Σᵢ₌₀ⁿ⁻¹ rⁱ = (1-rⁿ)/(1-r)，r≠1。', en: 'Σᵢ₌₀ⁿ⁻¹ rⁱ = (1-rⁿ)/(1-r), r≠1.' },
  tags: ['numerical', 'series'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
