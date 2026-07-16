// 幂运算（迭代） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-power-iter',
  categoryId: 'numerical',
  title: { zh: '幂运算（迭代）', en: 'Iterative Power' },
  summary: { zh: '用迭代乘法计算 x^n。', en: 'Compute x^n by iterative multiplication.' },
  description: {
    zh: '累乘 x 共 n 次，n 为非负整数。',
    en: 'Multiply x n times; n is a non-negative integer.',
  },
  tags: ['numerical', 'arithmetic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
