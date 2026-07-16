// 二阶有限差分 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-derivative-second',
  categoryId: 'numerical',
  title: { zh: '二阶有限差分', en: 'Second-Order Finite Difference' },
  summary: {
    zh: '用二阶中心差分近似二阶导数。',
    en: 'Approximate second derivative via central difference.',
  },
  description: {
    zh: "f''(x) ≈ (f(x+h)-2f(x)+f(x-h))/h²。",
    en: "f''(x) ≈ (f(x+h)-2f(x)+f(x-h))/h².",
  },
  tags: ['numerical', 'derivative'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
