import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'math-large-factorial',
  categoryId: 'math',
  title: { zh: '大数阶乘', en: 'Large Factorial (BigInt)' },
  summary: {
    zh: '用 BigInt 计算 n! 的精确值。',
    en: 'Compute n! exactly using BigInt.',
  },
  description: {
    zh: '顺序累乘 1..n，全部使用 BigInt 避免溢出。结果位数约为 O(n log n)。时间 O(n²)（考虑大整数乘法），空间 O(n log n)。',
    en: 'Multiply 1..n sequentially with BigInt. Result has O(n log n) digits. Time O(n²), space O(n log n).',
  },
  tags: ['math', 'factorial', 'bigint', 'number-theory'],
  complexity: { time: 'O(n²)', space: 'O(n log n)' },
};
