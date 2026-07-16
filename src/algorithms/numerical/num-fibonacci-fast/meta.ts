// 快速斐波那契 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-fibonacci-fast',
  categoryId: 'numerical',
  title: { zh: '快速斐波那契', en: 'Fast Fibonacci (Matrix)' },
  summary: {
    zh: '用快速幂矩阵法求第 n 个斐波那契数。',
    en: 'nth Fibonacci via fast matrix exponentiation.',
  },
  description: {
    zh: '利用 [[1,1],[1,0]]ⁿ 的快速幂，O(log n)。',
    en: 'Fast exponentiation of [[1,1],[1,0]]ⁿ in O(log n).',
  },
  tags: ['numerical', 'sequence'],
  complexity: { time: 'O(log n)', space: 'O(1)' },
};
