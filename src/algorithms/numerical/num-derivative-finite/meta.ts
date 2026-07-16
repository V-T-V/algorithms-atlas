// 有限差分求导 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-derivative-finite',
  categoryId: 'numerical',
  title: { zh: '有限差分求导', en: 'Finite-Difference Derivative' },
  summary: { zh: '用中心差分近似数值导数。', en: 'Approximate derivative via central difference.' },
  description: {
    zh: "f'(x) ≈ (f(x+h)-f(x-h))/(2h)，二阶精度。",
    en: "f'(x) ≈ (f(x+h)-f(x-h))/(2h); second-order accurate.",
  },
  tags: ['numerical', 'derivative'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
