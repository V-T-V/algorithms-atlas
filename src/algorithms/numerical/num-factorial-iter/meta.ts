// 阶乘（迭代） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-factorial-iter',
  categoryId: 'numerical',
  title: { zh: '阶乘（迭代）', en: 'Iterative Factorial' },
  summary: { zh: 'n!=1·2·…·n 的迭代实现。', en: 'Compute n!=1·2·…·n iteratively.' },
  description: { zh: '从 1 累乘到 n，0!=1。', en: 'Multiply 1..n; 0!=1 by definition.' },
  tags: ['numerical', 'combinatorics'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
