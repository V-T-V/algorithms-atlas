// 线性插值 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-linear-interp',
  categoryId: 'numerical',
  title: { zh: '线性插值', en: 'Linear Interpolation' },
  summary: { zh: '在两点间线性插值。', en: 'Linear interpolation between two points.' },
  description: { zh: 'y=y₀+(y₁-y₀)(x-x₀)/(x₁-x₀)。', en: 'y=y₀+(y₁-y₀)(x-x₀)/(x₁-x₀).' },
  tags: ['numerical', 'interpolation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
